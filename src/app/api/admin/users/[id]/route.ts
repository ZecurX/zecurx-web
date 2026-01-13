import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireRole, getClientIP, getUserAgent } from "@/lib/auth";
import { logCRUD } from "@/lib/audit";
import { ROLES, Role, UpdateUserRequest, AdminPublic } from "@/types/auth";
import { isValidRole, getAssignableRoles } from "@/lib/permissions";

// GET - Get single user (super_admin only)
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

        const { data: user, error } = await supabase
            .from('admins')
            .select('id, email, role, name, is_active, created_by, created_at, updated_at')
            .eq('id', id)
            .single();

        if (error || !user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user: user as AdminPublic });
    } catch (error) {
        console.error("Get user error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

// PUT - Update user (super_admin only)
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

        // Check if user exists
        const { data: existingUser, error: fetchError } = await supabase
            .from('admins')
            .select('id, email, role, name, is_active')
            .eq('id', id)
            .single();

        if (fetchError || !existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Prevent modifying super_admin role
        if (existingUser.role === ROLES.SUPER_ADMIN) {
            return NextResponse.json(
                { error: "Cannot modify super admin accounts" },
                { status: 403 }
            );
        }

        // Build update object
        const updates: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
        };

        if (email !== undefined) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
            }
            // Check if email is taken by another user
            const { data: emailUser } = await supabase
                .from('admins')
                .select('id')
                .eq('email', email)
                .neq('id', id)
                .single();

            if (emailUser) {
                return NextResponse.json({ error: "Email already in use" }, { status: 409 });
            }
            updates.email = email;
        }

        if (name !== undefined) {
            updates.name = name;
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
            updates.role = role;
        }

        if (is_active !== undefined) {
            updates.is_active = is_active;
        }

        // Update user
        const { data: updatedUser, error: updateError } = await supabase
            .from('admins')
            .update(updates)
            .eq('id', id)
            .select('id, email, role, name, is_active, created_by, created_at, updated_at')
            .single();

        if (updateError) {
            console.error("Failed to update user:", updateError);
            return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
        }

        // Log the action
        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logCRUD(
            { id: auth.session.sub, email: auth.session.email, role: auth.session.role as Role },
            'update',
            'user',
            id,
            { 
                previous: { email: existingUser.email, role: existingUser.role, name: existingUser.name, is_active: existingUser.is_active },
                updated: updates 
            },
            ipAddress,
            userAgent
        );

        return NextResponse.json({ user: updatedUser as AdminPublic });
    } catch (error) {
        console.error("Update user error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

// DELETE - Deactivate user (super_admin only)
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

        // Check if user exists
        const { data: existingUser, error: fetchError } = await supabase
            .from('admins')
            .select('id, email, role')
            .eq('id', id)
            .single();

        if (fetchError || !existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Prevent deleting super_admin
        if (existingUser.role === ROLES.SUPER_ADMIN) {
            return NextResponse.json(
                { error: "Cannot delete super admin accounts" },
                { status: 403 }
            );
        }

        // Prevent self-deletion
        if (existingUser.id === auth.session.sub) {
            return NextResponse.json(
                { error: "Cannot delete your own account" },
                { status: 403 }
            );
        }

        // Soft delete - set is_active to false
        const { error: updateError } = await supabase
            .from('admins')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (updateError) {
            console.error("Failed to deactivate user:", updateError);
            return NextResponse.json({ error: "Failed to deactivate user" }, { status: 500 });
        }

        // Log the action
        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logCRUD(
            { id: auth.session.sub, email: auth.session.email, role: auth.session.role as Role },
            'delete',
            'user',
            id,
            { email: existingUser.email, role: existingUser.role },
            ipAddress,
            userAgent
        );

        return NextResponse.json({ success: true, message: "User deactivated" });
    } catch (error) {
        console.error("Delete user error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
