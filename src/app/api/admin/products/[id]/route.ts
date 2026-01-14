import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePermission, getClientIP, getUserAgent } from "@/lib/auth";
import { logCRUD } from "@/lib/audit";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requirePermission('products', 'update', req);
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
            values.push(body.price);
        }
        if (body.description !== undefined) {
            updates.push(`description = $${paramIndex++}`);
            values.push(body.description);
        }
        if (body.image !== undefined) {
            updates.push(`image = $${paramIndex++}`);
            values.push(body.image);
        }
        if (body.images !== undefined) {
            updates.push(`images = $${paramIndex++}`);
            values.push(body.images);
        }
        if (body.stock !== undefined) {
            updates.push(`stock = $${paramIndex++}`);
            values.push(body.stock);
        }
        if (body.features !== undefined) {
            updates.push(`features = $${paramIndex++}`);
            values.push(body.features);
        }
        if (body.tags !== undefined) {
            updates.push(`tags = $${paramIndex++}`);
            values.push(body.tags);
        }
        if (body.delivery_days !== undefined) {
            updates.push(`delivery_days = $${paramIndex++}`);
            values.push(body.delivery_days);
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        values.push(id);

        const result = await db.query<{
            id: string;
            name: string;
            price: number;
            description: string | null;
            image: string | null;
            images: string[] | null;
            stock: number;
            features: string[] | null;
            tags: string[] | null;
            delivery_days: number;
            created_at: string;
        }>(
            `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

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

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Update Product Error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requirePermission('products', 'delete', req);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { session } = authResult;

    try {
        const { id } = await params;

        await db.query('DELETE FROM products WHERE id = $1', [id]);

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
    } catch (error) {
        console.error("Delete Product Error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
