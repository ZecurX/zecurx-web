import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        const result = await query(`
            SELECT * FROM products WHERE id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const relatedResult = await query(`
            SELECT * FROM products 
            WHERE id != $1 
            AND tags && $2::text[]
            LIMIT 4
        `, [id, result.rows[0].tags]);

        return NextResponse.json({ 
            product: result.rows[0],
            related: relatedResult.rows
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}
