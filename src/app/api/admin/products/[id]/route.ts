import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { supabase } from "@/lib/supabase";

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

// UPDATE Product
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!await verifyAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();

        const { data, error } = await supabase
            .from("products")
            .update(body)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Update Product Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE Product
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!await verifyAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;

        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete Product Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
