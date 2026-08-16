import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import * as argon2 from "argon2";
import { query } from "@/lib/db";
import { createToken, setSessionCookie, getClientIP, getUserAgent } from "@/lib/auth";
import { logLogin } from "@/lib/audit";
import { Role } from "@/types/auth";

// Legacy admins may still have a bcrypt hash from before the switch to argon2;
// verify against whichever format is stored and transparently upgrade to argon2 on success.
async function verifyPassword(password: string, hash: string): Promise<{ valid: boolean; upgradedHash?: string }> {
    if (hash.startsWith('$argon2')) {
        return { valid: await argon2.verify(hash, password) };
    }
    const valid = await compare(password, hash);
    if (!valid) {
        return { valid: false };
    }
    return { valid: true, upgradedHash: await argon2.hash(password) };
}

// Super admin emails - all use OTP-based authentication
const SUPER_USERS = (process.env.SUPER_ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        const isSuperUser = SUPER_USERS.includes(String(email).trim().toLowerCase());

        if (isSuperUser) {
            // Super User Flow: Uses OTP
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
            const { createOtp, sendOtpEmail } = await import('@/lib/otp');

            const otp = await createOtp(email, 'admin_login');
            const { sent, error: emailError } = await sendOtpEmail(email, otp, 'admin_login', 'Admin Portal');

            if (!sent) {
                console.error(`Admin OTP email failed for ${email}:`, emailError);
                return NextResponse.json(
                    { error: 'Failed to send verification email. Please try again later.' },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                otpRequired: true,
                email: email
            });
        }

        // Normal User Flow: Uses Password
        if (!password) {
            return NextResponse.json({ error: "Password required" }, { status: 400 });
        }

        const result = await query(
            'SELECT id, email, password_hash, role, name, is_active FROM admins WHERE email = $1 LIMIT 1',
            [email]
        );

        const admin = result.rows[0];

        if (!admin || !admin.is_active) {
            // Return generic error for security or explicit if deactivated
            return NextResponse.json(
                { error: admin && !admin.is_active ? "Account is deactivated" : "Invalid credentials" },
                { status: 401 }
            );
        }

        const { valid: isValid, upgradedHash } = await verifyPassword(password, admin.password_hash);

        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        if (upgradedHash) {
            await query('UPDATE admins SET password_hash = $1 WHERE id = $2', [upgradedHash, admin.id]);
        }

        // Enforce Role Restrictions
        let assignedRole = admin.role as Role;
        if (assignedRole === 'super_admin') {
            assignedRole = 'admin'; // Demote if not in allowed list
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
    } catch (error: unknown) {
        console.error("Auth Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);

        // Check for database connection errors
        const isDBError = errorMessage.includes('timeout') ||
                         errorMessage.includes('ETIMEDOUT') ||
                         errorMessage.includes('Connection terminated') ||
                         errorMessage.includes('connection') ||
                         errorMessage.includes('database');

        if (isDBError) {
            return NextResponse.json({
                error: "Service temporarily unavailable. Please try again later."
            }, { status: 503 });
        }

        return NextResponse.json({
            error: "Internal server error. Please try again."
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
