import { NextRequest, NextResponse } from "next/server";
import { verifySessionFromRequest, clearSessionCookie, getClientIP, getUserAgent } from "@/lib/auth";
import { logLogout } from "@/lib/audit";

export async function POST(req: NextRequest) {
    try {
        // Get current session before clearing
        const session = await verifySessionFromRequest(req);

        // Log logout event if session exists
        if (session) {
            const ipAddress = getClientIP(req);
            const userAgent = getUserAgent(req);
            await logLogout(
                { id: session.sub, email: session.email, role: session.role },
                ipAddress,
                userAgent
            );
        }

        // Clear the session cookie
        await clearSessionCookie();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Logout Error:", error);
        // Still try to clear the cookie even if there's an error
        try {
            await clearSessionCookie();
        } catch {
            // Ignore cleanup errors
        }
        return NextResponse.json({ success: true });
    }
}
