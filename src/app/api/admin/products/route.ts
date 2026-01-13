import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requirePermission, getClientIP, getUserAgent } from "@/lib/auth";
import { logCRUD } from "@/lib/audit";

export async function POST(req: NextRequest) {
    const authResult = await requirePermission('products', 'create', req);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { session } = authResult;

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

        // Log the action
        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logCRUD(
            { id: session.sub, email: session.email, role: session.role },
            'create',
            'products',
            data.id,
            body,
            ipAddress,
            userAgent
        );

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Create Product Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
