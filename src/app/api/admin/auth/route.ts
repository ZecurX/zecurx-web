import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

export async function POST(req: NextRequest) {
    try {
        const { password } = await req.json();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            return NextResponse.json(
                { error: "Admin password not configured on server" },
                { status: 500 }
            );
        }

        if (password !== adminPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        // Create JWT
        const secret = new TextEncoder().encode(adminPassword);
        const token = await new SignJWT({ role: "admin" })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret);

        // Set cookie
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
