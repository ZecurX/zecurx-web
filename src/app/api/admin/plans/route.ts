import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface Plan {
    id: string;
    name: string;
    price: number;
    type: string;
    description: string | null;
    active: boolean;
    in_stock: boolean;
}

export async function GET() {
    try {
        const result = await query<Plan>(`
            SELECT id, name, price, type, description, active, 
                   COALESCE(in_stock, true) as in_stock
            FROM zecurx_admin.plans 
            WHERE active = true
            ORDER BY type, name
        `);

        return NextResponse.json({ plans: result.rows });
    } catch (error) {
        console.error('Error fetching plans:', error);
        return NextResponse.json(
            { error: 'Failed to fetch plans' },
            { status: 500 }
        );
    }
}
