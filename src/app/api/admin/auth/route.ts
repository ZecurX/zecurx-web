import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import * as argon2 from "argon2";
import { query } from "@/lib/db";
import { createToken, setSessionCookie, getClientIP, getUserAgent } from "@/lib/auth";
import { logLogin } from "@/lib/audit";
import { Admin, Role } from "@/types/auth";

async function verifyPassword(password: string, hash: string): Promise<boolean> {
    if (hash.startsWith('$argon2')) {
        return argon2.verify(hash, password);
    }
    return compare(password, hash);
}

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password required" }, { status: 400 });
        }

        const SUPER_USERS = [
            'zecurxintern@gmail.com',
            'mohitsen.official16@gmail.com',
            'hrshpriyam@gmail.com'
        ];

        const isSuperUser = SUPER_USERS.includes(email);

        if (isSuperUser) {
            // For super users, we use OTP based login
            // First check if user exists (optional, but good for security to not leak info, 
            // but here we want to allow these specific emails even if DB record is missing? 
            // No, they must exist in DB to have a user ID)

            // Actually, let's verify they exist in DB
            const result = await query(
                'SELECT id, email, name, is_active FROM admins WHERE email = $1 LIMIT 1',
                [email]
            );
            const admin = result.rows[0];

            if (!admin) {
                return NextResponse.json({ error: "Access Denied" }, { status: 403 });
            }

            if (!admin.is_active) {
                return NextResponse.json({ error: "Account is deactivated" }, { status: 401 });
            }

            // Generate and send OTP
            // Import dynamically to avoid circular deps if any, though none expected here
            const { createOtp, sendOtpEmail } = await import('@/lib/otp');

            const otp = await createOtp(email, 'admin_login');
            await sendOtpEmail(email, otp, 'admin_login', 'Admin Portal');

            return NextResponse.json({
                success: true,
                otpRequired: true,
                email: email
            });
        }

        // Normal User Login (Password based)
        const result = await query(
            'SELECT id, email, password_hash, role, name, is_active FROM admins WHERE email = $1 LIMIT 1',
            [email]
        );

        const admin = result.rows[0];

        if (!admin) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        if (!admin.is_active) {
            return NextResponse.json({ error: "Account is deactivated" }, { status: 401 });
        }

        const isValid = await verifyPassword(password, admin.password_hash);

        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Enforce Role Restrictions
        // If not in SUPER_USERS, cannot be SUPER_ADMIN
        let assignedRole = admin.role as Role;
        if (assignedRole === 'super_admin') {
            // Demote to admin if they are not in the allowed list
            // This handles cases where DB might have old data
            assignedRole = 'admin';
        }

        const token = await createToken({
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: assignedRole,
        });

        await setSessionCookie(token);

        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logLogin(
            { id: admin.id, email: admin.email, role: assignedRole },
            ipAddress,
            userAgent
        );

        return NextResponse.json({
            success: true,
            user: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: assignedRole,
            }
        });
    } catch (error) {
        console.error("Auth Error:", error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Internal Error",
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { verifySession } = await import("@/lib/auth");
        const session = await verifySession();

        if (!session) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        return NextResponse.json({
            user: {
                id: session.sub,
                email: session.email,
                name: session.name,
                role: session.role,
            }
        });
    } catch (error) {
        console.error("Session Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
