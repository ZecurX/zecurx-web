import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { compare } from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client (Service Role)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password required" }, { status: 400 });
        }

        // 1. Fetch Admin User
        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !admin) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // 2. Verify Password
        const isValid = await compare(password, admin.password_hash);

        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // 3. Create JWT (include admin ID and email)
        const secret = new TextEncoder().encode(process.env.ADMIN_PASSWORD);
        // Note: Still using ADMIN_PASSWORD as the secret key for signing tokens, which is fine.

        const token = await new SignJWT({
            sub: admin.id,
            email: admin.email,
            role: "admin"
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret);

        // 4. Set Cookie
        (await cookies()).set("admin_session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
            sameSite: "strict",
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Auth Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
