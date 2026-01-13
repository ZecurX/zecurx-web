import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { requireRole, getClientIP, getUserAgent } from "@/lib/auth";
import { logPasswordReset } from "@/lib/audit";
import { ROLES, Role, PasswordResetRequest } from "@/types/auth";

// POST - Reset user password (super_admin only)
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireRole([ROLES.SUPER_ADMIN], req);
    
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body: PasswordResetRequest = await req.json();
        const { new_password } = body;

        // Validate password
        if (!new_password || new_password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // Check if user exists
        const { data: existingUser, error: fetchError } = await supabase
            .from('admins')
            .select('id, email, role')
            .eq('id', id)
            .single();

        if (fetchError || !existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Hash new password
        const passwordHash = await hash(new_password, 10);

        // Update password
        const { error: updateError } = await supabase
            .from('admins')
            .update({ 
                password_hash: passwordHash, 
                updated_at: new Date().toISOString() 
            })
            .eq('id', id);

        if (updateError) {
            console.error("Failed to reset password:", updateError);
            return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
        }

        // Log the action
        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logPasswordReset(
            { id: auth.session.sub, email: auth.session.email, role: auth.session.role as Role },
            existingUser.id,
            existingUser.email,
            ipAddress,
            userAgent
        );

        return NextResponse.json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.error("Password reset error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
