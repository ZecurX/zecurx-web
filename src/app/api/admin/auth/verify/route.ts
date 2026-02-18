import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { createToken, setSessionCookie, getClientIP, getUserAgent } from "@/lib/auth";
import { logLogin } from "@/lib/audit";
import { Role } from "@/types/auth";
import { verifyOtp } from "@/lib/otp";

export async function POST(req: NextRequest) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });
        }

        const verification = await verifyOtp(email, otp, 'admin_login');

        if (!verification.valid) {
            return NextResponse.json({ error: verification.error || "Invalid OTP" }, { status: 401 });
        }

        const result = await query(
            'SELECT id, email, role, name, is_active FROM admins WHERE email = $1 LIMIT 1',
            [email]
        );

        const admin = result.rows[0];

        if (!admin || !admin.is_active) {
            return NextResponse.json(
                { error: "Access Denied" },
                { status: admin ? 401 : 404 }
            );
        }

        // Issue token
        const token = await createToken({
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role as Role,
        });

        await setSessionCookie(token);

        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logLogin(
            { id: admin.id, email: admin.email, role: admin.role as Role },
            ipAddress,
            userAgent
        );

        return NextResponse.json({
            success: true,
            user: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
            }
        });

    } catch (error) {
        console.error("OTP Verify Error:", error);
        return NextResponse.json({
            error: "Internal Error"
        }, { status: 500 });
    }
}
