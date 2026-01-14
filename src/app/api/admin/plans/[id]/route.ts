import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
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

        const updates: string[] = [];
        const values: unknown[] = [];
        let paramIndex = 1;

        if (body.name !== undefined) {
            updates.push(`name = $${paramIndex++}`);
            values.push(body.name);
        }
        if (body.price !== undefined) {
            updates.push(`price = $${paramIndex++}`);
            values.push(Number(body.price));
        }
        if (body.description !== undefined) {
            updates.push(`description = $${paramIndex++}`);
            values.push(body.description);
        }
        if (body.active !== undefined) {
            updates.push(`active = $${paramIndex++}`);
            values.push(body.active);
        }
        if (body.in_stock !== undefined) {
            updates.push(`in_stock = $${paramIndex++}`);
            values.push(body.in_stock);
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        values.push(id);

        const result = await db.query<{
            id: string;
            name: string;
            type: string;
            price: number;
            description: string | null;
            active: boolean;
            in_stock: boolean;
            created_at: string;
        }>(
            `UPDATE plans SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        }

        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logCRUD(
            { id: session.sub, email: session.email, role: session.role },
            'update',
            'plans',
            id,
            body,
            ipAddress,
            userAgent
        );

        return NextResponse.json(result.rows[0]);
    } catch (error: unknown) {
        console.error("Update Plan Error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
