import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { requireRole, getClientIP, getUserAgent } from "@/lib/auth";
import { logCRUD } from "@/lib/audit";
import { ROLES, Role, CreateUserRequest, AdminPublic } from "@/types/auth";
import { isValidRole, getAssignableRoles } from "@/lib/permissions";

// GET - List all admin users (super_admin only)
export async function GET(req: NextRequest) {
    const auth = await requireRole([ROLES.SUPER_ADMIN], req);
    
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        const { data: users, error } = await supabase
            .from('admins')
            .select('id, email, role, name, is_active, created_by, created_at, updated_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Failed to fetch users:", error);
            return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
        }

        return NextResponse.json({ users: users as AdminPublic[] });
    } catch (error) {
        console.error("Get users error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

// POST - Create new admin user (super_admin only)
export async function POST(req: NextRequest) {
    const auth = await requireRole([ROLES.SUPER_ADMIN], req);
    
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        const body: CreateUserRequest = await req.json();
        const { email, password, name, role } = body;

        // Validate required fields
        if (!email || !password || !name || !role) {
            return NextResponse.json(
                { error: "Email, password, name, and role are required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // Validate role
        if (!isValidRole(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        // Super admin cannot create other super admins
        const assignableRoles = getAssignableRoles(auth.session.role as Role);
        if (!assignableRoles.includes(role)) {
            return NextResponse.json(
                { error: "You cannot assign this role" },
                { status: 403 }
            );
        }

        // Check if email already exists
        const { data: existingUser } = await supabase
            .from('admins')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await hash(password, 10);

        // Create user
        const { data: newUser, error } = await supabase
            .from('admins')
            .insert({
                email,
                password_hash: passwordHash,
                name,
                role,
                is_active: true,
                created_by: auth.session.sub,
            })
            .select('id, email, role, name, is_active, created_by, created_at, updated_at')
            .single();

        if (error) {
            console.error("Failed to create user:", error);
            return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
        }

        // Log the action
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

        return NextResponse.json({ user: newUser as AdminPublic }, { status: 201 });
    } catch (error) {
        console.error("Create user error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
