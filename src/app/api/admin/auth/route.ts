import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { createToken, setSessionCookie, getClientIP, getUserAgent } from "@/lib/auth";
import { logLogin } from "@/lib/audit";
import { Admin, Role } from "@/types/auth";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password required" }, { status: 400 });
        }

        // 1. Fetch Admin User with all RBAC fields
        const { data: admin, error } = await supabase
            .from('admins')
            .select('id, email, password_hash, role, name, is_active')
            .eq('email', email)
            .single();

        if (error || !admin) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // 2. Check if account is active
        if (!admin.is_active) {
            return NextResponse.json({ error: "Account is deactivated" }, { status: 401 });
        }

        // 3. Verify Password
        const isValid = await compare(password, admin.password_hash);

        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // 4. Create JWT with role information
        const token = await createToken({
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role as Role,
        });

        // 5. Set Cookie
        await setSessionCookie(token);

        // 6. Log the login event
        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logLogin(
            { id: admin.id, email: admin.email, role: admin.role as Role },
            ipAddress,
            userAgent
        );

        // 7. Return success with user info (excluding sensitive data)
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
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// GET endpoint to fetch current session info
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
