import { NextRequest, NextResponse } from "next/server";
import { db, query } from "@/lib/db";
import { requirePermission, getClientIP, getUserAgent } from "@/lib/auth";
import { logCRUD } from "@/lib/audit";

export async function GET(req: NextRequest) {
    const authResult = await requirePermission('products', 'read', req);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const result = await query(`
            SELECT * FROM products 
            ORDER BY created_at DESC
        `);

        return NextResponse.json({ products: result.rows });
    } catch (error) {
        console.error("Get Products Error:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const authResult = await requirePermission('products', 'create', req);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { session } = authResult;

    try {
        const body = await req.json();

        if (!body.name || !body.price) {
            return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
        }

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
            `INSERT INTO products (name, price, description, image, images, stock, features, tags, delivery_days)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                body.name,
                body.price,
                body.description || null,
                body.image || null,
                body.images || null,
                body.stock || 0,
                body.features || null,
                body.tags || null,
                body.delivery_days || 5
            ]
        );

        const data = result.rows[0];

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
    } catch (error) {
        console.error("Create Product Error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
