import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole, getClientIP, getUserAgent } from "@/lib/auth";
import { logCRUD } from "@/lib/audit";
import { ROLES, Role, UpdateUserRequest, AdminPublic } from "@/types/auth";
import { isValidRole, getAssignableRoles } from "@/lib/permissions";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireRole([ROLES.SUPER_ADMIN], req);
    
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        const { id } = await params;

        const result = await db.query<AdminPublic>(
            `SELECT id, email, role, name, is_active, created_by, created_at, updated_at
            FROM admins WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user: result.rows[0] });
    } catch (error) {
        console.error("Get user error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireRole([ROLES.SUPER_ADMIN], req);
    
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body: UpdateUserRequest = await req.json();
        const { email, name, role, is_active } = body;

        const existingResult = await db.query<{ id: string; email: string; role: string; name: string; is_active: boolean }>(
            'SELECT id, email, role, name, is_active FROM admins WHERE id = $1',
            [id]
        );

        if (existingResult.rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const existingUser = existingResult.rows[0];

        if (existingUser.role === ROLES.SUPER_ADMIN) {
            return NextResponse.json(
                { error: "Cannot modify super admin accounts" },
                { status: 403 }
            );
        }

        const updates: string[] = ['updated_at = NOW()'];
        const values: unknown[] = [];
        let paramIndex = 1;
        const updateDetails: Record<string, unknown> = {};

        if (email !== undefined) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
            }
            
            const emailCheck = await db.query<{ id: string }>(
                'SELECT id FROM admins WHERE email = $1 AND id != $2',
                [email, id]
            );

            if (emailCheck.rows.length > 0) {
                return NextResponse.json({ error: "Email already in use" }, { status: 409 });
            }
            updates.push(`email = $${paramIndex++}`);
            values.push(email);
            updateDetails.email = email;
        }

        if (name !== undefined) {
            updates.push(`name = $${paramIndex++}`);
            values.push(name);
            updateDetails.name = name;
        }

        if (role !== undefined) {
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
            updates.push(`role = $${paramIndex++}`);
            values.push(role);
            updateDetails.role = role;
        }

        if (is_active !== undefined) {
            updates.push(`is_active = $${paramIndex++}`);
            values.push(is_active);
            updateDetails.is_active = is_active;
        }

        values.push(id);

        const updateResult = await db.query<AdminPublic>(
            `UPDATE admins SET ${updates.join(', ')} WHERE id = $${paramIndex}
            RETURNING id, email, role, name, is_active, created_by, created_at, updated_at`,
            values
        );

        const updatedUser = updateResult.rows[0];

        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logCRUD(
            { id: auth.session.sub, email: auth.session.email, role: auth.session.role as Role },
            'update',
            'user',
            id,
            { 
                previous: { email: existingUser.email, role: existingUser.role, name: existingUser.name, is_active: existingUser.is_active },
                updated: updateDetails 
            },
            ipAddress,
            userAgent
        );

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error("Update user error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireRole([ROLES.SUPER_ADMIN], req);
    
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const permanent = searchParams.get('permanent') === 'true';

        const existingResult = await db.query<{ id: string; email: string; role: string }>(
            'SELECT id, email, role FROM admins WHERE id = $1',
            [id]
        );

        if (existingResult.rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const existingUser = existingResult.rows[0];

        if (existingUser.role === ROLES.SUPER_ADMIN) {
            return NextResponse.json(
                { error: "Cannot delete super admin accounts" },
                { status: 403 }
            );
        }

        if (existingUser.id === auth.session.sub) {
            return NextResponse.json(
                { error: "Cannot delete your own account" },
                { status: 403 }
            );
        }

        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);

        if (permanent) {
            await db.query('DELETE FROM admins WHERE id = $1', [id]);
            
            await logCRUD(
                { id: auth.session.sub, email: auth.session.email, role: auth.session.role as Role },
                'delete',
                'user',
                id,
                { email: existingUser.email, role: existingUser.role, permanent: true },
                ipAddress,
                userAgent
            );

            return NextResponse.json({ success: true, message: "User permanently deleted" });
        } else {
            await db.query(
                'UPDATE admins SET is_active = false, updated_at = NOW() WHERE id = $1',
                [id]
            );

            await logCRUD(
                { id: auth.session.sub, email: auth.session.email, role: auth.session.role as Role },
                'delete',
                'user',
                id,
                { email: existingUser.email, role: existingUser.role, deactivated: true },
                ipAddress,
                userAgent
            );

            return NextResponse.json({ success: true, message: "User deactivated" });
        }
    } catch (error) {
        console.error("Delete user error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
