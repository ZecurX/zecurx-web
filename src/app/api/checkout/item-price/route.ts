import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface ItemPriceResponse {
    id: string;
    name: string;
    price: number;
    type: 'internship' | 'course';
    description?: string;
    error?: string;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const itemId = searchParams.get('itemId');
        const type = searchParams.get('type') || 'course';

        if (!itemId) {
            return NextResponse.json<{ error: string }>(
                { error: 'itemId is required' },
                { status: 400 }
            );
        }

        const planResult = await query(
            'SELECT id, name, price, description, type FROM plans WHERE id::text = $1 AND active = true',
            [itemId]
        );
        
        if (planResult.rows.length > 0) {
            const plan = planResult.rows[0];
            const itemType = plan.type === 'internship' ? 'internship' : (type as 'internship' | 'course');
            
            return NextResponse.json<ItemPriceResponse>({
                id: plan.id.toString(),
                name: plan.name,
                price: parseFloat(plan.price),
                type: itemType,
                description: plan.description || undefined
            });
        }

        return NextResponse.json<{ error: string }>(
            { error: 'Item not found' },
            { status: 404 }
        );
    } catch (error) {
        console.error('Error fetching item price:', error);
        return NextResponse.json<{ error: string }>(
            { error: 'Failed to fetch item' },
            { status: 500 }
        );
    }
}
