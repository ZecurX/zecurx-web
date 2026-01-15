import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { requireRole, getClientIP, getUserAgent } from "@/lib/auth";
import { logCRUD } from "@/lib/audit";
import { ROLES, Role, CreateUserRequest, AdminPublic } from "@/types/auth";
import { isValidRole, getAssignableRoles } from "@/lib/permissions";

export async function GET(req: NextRequest) {
    const auth = await requireRole([ROLES.SUPER_ADMIN], req);
    
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        const result = await db.query<AdminPublic>(
            `SELECT id, email, role, name, is_active, created_by, created_at, updated_at
            FROM admins
            ORDER BY created_at DESC`
        );

        return NextResponse.json({ users: result.rows });
    } catch (error) {
        console.error("Get users error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireRole([ROLES.SUPER_ADMIN], req);
    
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        const body: CreateUserRequest = await req.json();
        const { email, password, name, role } = body;

        if (!email || !password || !name || !role) {
            return NextResponse.json(
                { error: "Email, password, name, and role are required" },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        if (!isValidRole(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        const assignableRoles = getAssignableRoles(auth.session.role as Role);
        if (!assignableRoles.includes(role)) {
            return NextResponse.json(
                { error: "You cannot assign this role" },
                { status: 403 }
            );
        }

        const existingResult = await db.query<{ id: string }>(
            'SELECT id FROM admins WHERE email = $1',
            [email]
        );

        if (existingResult.rows.length > 0) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 409 }
            );
        }

        const passwordHash = await hash(password, 10);

        const insertResult = await db.query<AdminPublic>(
            `INSERT INTO admins (email, password_hash, name, role, is_active, created_by)
            VALUES ($1, $2, $3, $4, true, $5)
            RETURNING id, email, role, name, is_active, created_by, created_at, updated_at`,
            [email, passwordHash, name, role, auth.session.sub]
        );

        const newUser = insertResult.rows[0];

        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logCRUD(
            { id: auth.session.sub, email: auth.session.email, role: auth.session.role as Role },
            'create',
            'user',
            newUser.id,
            { email: newUser.email, role: newUser.role, name: newUser.name },
            ipAddress,
            userAgent
        );

        return NextResponse.json({ user: newUser }, { status: 201 });
    } catch (error) {
        console.error("Create user error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
