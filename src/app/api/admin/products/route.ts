import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { supabase } from "@/lib/supabase";

// Helper to verify admin session
async function verifyAdmin() {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session) return false;

    try {
        const secret = new TextEncoder().encode(process.env.ADMIN_PASSWORD);
        await jwtVerify(session.value, secret);
        return true;
    } catch {
        return false;
    }
}

export async function POST(req: NextRequest) {
    if (!await verifyAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();

        // Basic validation
        if (!body.name || !body.price) {
            return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("products")
            .insert([body])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Create Product Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
