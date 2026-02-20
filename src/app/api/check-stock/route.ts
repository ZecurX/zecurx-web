import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface CartItem {
    id: string;
    name: string;
    quantity: number;
}

interface ProductRow {
    id: string;
    name: string;
    stock: number;
}

interface UnavailableItem {
    id: string;
    name: string;
    available?: number;
    requested?: number;
    reason: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { items } = body as { items: CartItem[] };

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { available: false, error: 'No items provided' },
                { status: 400 }
            );
        }

        const productIds = items.map(item => item.id);
        
        const result = await query<ProductRow>(
            `SELECT id, name, stock FROM products WHERE id::text = ANY($1)`,
            [productIds]
        );

        const productsMap = new Map(
            result.rows.map((p) => [String(p.id), p])
        );

        const unavailableItems: UnavailableItem[] = [];

        for (const item of items) {
            const product = productsMap.get(item.id);

            if (!product) {
                unavailableItems.push({
                    id: item.id,
                    name: item.name,
                    reason: 'Product not found',
                });
                continue;
            }
            
            const stock = Number(product.stock);
            
            if (stock === null || stock < item.quantity) {
                unavailableItems.push({
                    id: item.id,
                    name: product.name,
                    available: stock || 0,
                    requested: item.quantity,
                    reason: stock === 0 ? 'Out of stock' : 'Insufficient stock',
                });
            }
        }

        if (unavailableItems.length > 0) {
            return NextResponse.json({
                available: false,
                unavailableItems,
            });
        }

        return NextResponse.json({ available: true });
    } catch (error) {
        console.error('Error checking stock:', error);
        return NextResponse.json(
            { available: false, error: 'Failed to check stock availability' },
            { status: 500 }
        );
    }
}
