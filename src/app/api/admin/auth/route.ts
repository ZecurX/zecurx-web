import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import * as argon2 from "argon2";
import { query } from "@/lib/db";
import { createToken, setSessionCookie, getClientIP, getUserAgent } from "@/lib/auth";
import { logLogin } from "@/lib/audit";
import { Role } from "@/types/auth";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const isUpstashConfigured = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

let adminLoginRateLimiter: Ratelimit | null = null;

if (isUpstashConfigured) {
    const redis = new Redis({
        url: UPSTASH_URL!,
        token: UPSTASH_TOKEN!,
    });

    adminLoginRateLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "15 m"),
        analytics: true,
        prefix: "ratelimit:admin-login",
    });
}

const MAX_FAILED_ATTEMPTS = 10;
const LOCKOUT_DURATION_MINUTES = 30;

async function verifyPassword(password: string, hash: string): Promise<boolean> {
    if (hash.startsWith('$argon2')) {
        return argon2.verify(hash, password);
    }
    return compare(password, hash);
}

async function getFailedAttempts(email: string): Promise<number> {
    try {
        const result = await query<{ failed_login_attempts: number }>(
            'SELECT failed_login_attempts FROM admins WHERE email = $1',
            [email]
        );
        return result.rows[0]?.failed_login_attempts || 0;
    } catch {
        return 0;
    }
}

async function incrementFailedAttempts(email: string): Promise<void> {
    try {
        await query(
            `UPDATE admins 
             SET failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1,
                 locked_until = CASE 
                     WHEN COALESCE(failed_login_attempts, 0) + 1 >= $2 
                     THEN NOW() + INTERVAL '${LOCKOUT_DURATION_MINUTES} minutes'
                     ELSE locked_until 
                 END
             WHERE email = $1`,
            [email, MAX_FAILED_ATTEMPTS]
        );
    } catch (error) {
        console.error("Failed to increment failed attempts:", error);
    }
}

async function resetFailedAttempts(email: string): Promise<void> {
    try {
        await query(
            'UPDATE admins SET failed_login_attempts = 0, locked_until = NULL WHERE email = $1',
            [email]
        );
    } catch (error) {
        console.error("Failed to reset failed attempts:", error);
    }
}

async function isAccountLocked(email: string): Promise<boolean> {
    try {
        const result = await query<{ locked_until: Date | null }>(
            'SELECT locked_until FROM admins WHERE email = $1',
            [email]
        );
        const lockedUntil = result.rows[0]?.locked_until;
        if (!lockedUntil) return false;
        return new Date(lockedUntil) > new Date();
    } catch {
        return false;
    }
}

export async function POST(req: NextRequest) {
    try {
        const clientIp = getClientIP(req) || 'unknown';

        if (adminLoginRateLimiter) {
            const { success, remaining, reset } = await adminLoginRateLimiter.limit(clientIp);
            if (!success) {
                const retryAfter = Math.ceil((reset - Date.now()) / 1000);
                return NextResponse.json(
                    { error: "Too many login attempts. Please try again later." },
                    { 
                        status: 429,
                        headers: {
                            'Retry-After': String(retryAfter),
                            'X-RateLimit-Remaining': String(remaining),
                        }
                    }
                );
            }
        }

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password required" }, { status: 400 });
        }

        if (await isAccountLocked(email)) {
            return NextResponse.json(
                { error: "Account temporarily locked due to too many failed attempts. Try again later." },
                { status: 423 }
            );
        }

        const result = await query(
            'SELECT id, email, password_hash, role, name, is_active, failed_login_attempts FROM admins WHERE email = $1 LIMIT 1',
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
            await incrementFailedAttempts(email);
            const attempts = await getFailedAttempts(email);
            const attemptsRemaining = MAX_FAILED_ATTEMPTS - attempts;
            
            if (attemptsRemaining <= 3 && attemptsRemaining > 0) {
                return NextResponse.json(
                    { error: `Invalid credentials. ${attemptsRemaining} attempts remaining before lockout.` },
                    { status: 401 }
                );
            }
            
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        await resetFailedAttempts(email);

        const token = await createToken({
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role as Role,
        });

        await setSessionCookie(token);

        const userAgent = getUserAgent(req);
        await logLogin(
            { id: admin.id, email: admin.email, role: admin.role as Role },
            clientIp,
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
        console.error("Auth Error:", error);
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
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
