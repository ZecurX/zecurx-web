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

        // Verify OTP - Purpose 'admin_login', seminarId is undefined/null
        const verification = await verifyOtp(email, otp, 'admin_login');

        if (!verification.valid) {
            return NextResponse.json({ error: verification.error || "Invalid OTP" }, { status: 401 });
        }

        // Get admin user
        const result = await query(
            'SELECT id, email, role, name, is_active FROM admins WHERE email = $1 LIMIT 1',
            [email]
        );

        const admin = result.rows[0];

        if (!admin) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!admin.is_active) {
            return NextResponse.json({ error: "Account is deactivated" }, { status: 401 });
        }

        // Issue token
        // Ensure role matches what we expect (Super Admin), or trust DB.
        // Since we only forced OTP for super users, we can just use the DB role.
        // But double check against our list just in case needed? 
        // Logic in auth/route.ts enforced OTP for specific emails. 
        // Here we just verify OTP and log them in.

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
            error: error instanceof Error ? error.message : "Internal Error"
        }, { status: 500 });
    }
}
