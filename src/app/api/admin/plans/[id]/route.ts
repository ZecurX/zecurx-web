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
        if (body.test_mode !== undefined) {
            updates.push(`test_mode = $${paramIndex++}`);
            values.push(body.test_mode);
        }
        if (body.duration !== undefined) {
            updates.push(`duration = $${paramIndex++}`);
            values.push(body.duration);
        }
        if (body.level !== undefined) {
            updates.push(`level = $${paramIndex++}`);
            values.push(body.level);
        }
        if (body.features !== undefined) {
            updates.push(`features = $${paramIndex++}`);
            values.push(JSON.stringify(body.features));
        }
        if (body.logo !== undefined) {
            updates.push(`logo = $${paramIndex++}`);
            values.push(body.logo);
        }
        if (body.original_price !== undefined) {
            updates.push(`original_price = $${paramIndex++}`);
            values.push(body.original_price === null ? null : Number(body.original_price));
        }
        if (body.popular !== undefined) {
            updates.push(`popular = $${paramIndex++}`);
            values.push(body.popular);
        }
        if (body.students_count !== undefined) {
            updates.push(`students_count = $${paramIndex++}`);
            values.push(body.students_count === null ? null : Number(body.students_count));
        }
        if (body.brochure_link !== undefined) {
            updates.push(`brochure_link = $${paramIndex++}`);
            values.push(body.brochure_link);
        }
        if (body.pricing_type !== undefined) {
            updates.push(`pricing_type = $${paramIndex++}`);
            values.push(body.pricing_type);
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
            duration: string | null;
            level: string | null;
            features: string[] | null;
            logo: string | null;
            original_price: number | null;
            popular: boolean;
            students_count: number | null;
            brochure_link: string | null;
            pricing_type: string;
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
