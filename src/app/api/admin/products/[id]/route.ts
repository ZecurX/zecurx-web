import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requirePermission, getClientIP, getUserAgent } from "@/lib/auth";
import { logCRUD } from "@/lib/audit";

// UPDATE Product
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requirePermission('products', 'update', req);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { session } = authResult;

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

        // Log the action
        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logCRUD(
            { id: session.sub, email: session.email, role: session.role },
            'update',
            'products',
            id,
            body,
            ipAddress,
            userAgent
        );

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Update Product Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE Product
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requirePermission('products', 'delete', req);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { session } = authResult;

    try {
        const { id } = await params;

        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", id);

        if (error) throw error;

        // Log the action
        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logCRUD(
            { id: session.sub, email: session.email, role: session.role },
            'delete',
            'products',
            id,
            undefined,
            ipAddress,
            userAgent
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete Product Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
