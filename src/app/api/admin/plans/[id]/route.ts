import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requirePermission, getClientIP, getUserAgent } from "@/lib/auth";
import { logCRUD } from "@/lib/audit";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requirePermission('plans', 'update', req);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { session } = authResult;

    try {
        const { id } = await params;
        const body = await req.json();

        const updateData: Record<string, unknown> = {};
        if (body.name !== undefined) updateData.name = body.name;
        if (body.price !== undefined) updateData.price = Number(body.price);
        if (body.description !== undefined) updateData.description = body.description;
        if (body.active !== undefined) updateData.active = body.active;
        if (body.in_stock !== undefined) updateData.in_stock = body.in_stock;

        const { data, error } = await supabase
            .from("plans")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logCRUD(
            { id: session.sub, email: session.email, role: session.role },
            'update',
            'plans',
            id,
            updateData,
            ipAddress,
            userAgent
        );

        return NextResponse.json(data);
    } catch (error: unknown) {
        console.error("Update Plan Error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
