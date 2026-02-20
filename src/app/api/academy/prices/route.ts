import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const result = await query<{ id: string; price: string }>(
            'SELECT id, price FROM plans'
        );
        const prices: Record<string, number> = {};
        for (const row of result.rows) {
            const parsed = parseFloat(row.price);
            if (!isNaN(parsed)) {
                prices[row.id] = parsed;
            }
        }
        return NextResponse.json(prices);
    } catch {
        return NextResponse.json({}, { status: 500 });
    }
}
