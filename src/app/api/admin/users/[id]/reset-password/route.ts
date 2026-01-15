import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { requireRole, getClientIP, getUserAgent } from "@/lib/auth";
import { logPasswordReset } from "@/lib/audit";
import { ROLES, Role, PasswordResetRequest } from "@/types/auth";

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

        if (!new_password || new_password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        const existingResult = await db.query<{ id: string; email: string; role: string }>(
            'SELECT id, email, role FROM admins WHERE id = $1',
            [id]
        );

        if (existingResult.rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const existingUser = existingResult.rows[0];

        const passwordHash = await hash(new_password, 10);

        await db.query(
            'UPDATE admins SET password_hash = $1, updated_at = NOW() WHERE id = $2',
            [passwordHash, id]
        );

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
