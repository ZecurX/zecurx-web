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
    test_mode: boolean;
    duration: string | null;
    level: string | null;
    features: string[] | null;
    logo: string | null;
    original_price: number | null;
    popular: boolean;
    students_count: number | null;
    brochure_link: string | null;
    pricing_type: string;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const all = searchParams.get('all') === 'true';

        const result = await query<Plan>(`
            SELECT id, name, price, type, description, active, 
                   COALESCE(in_stock, true) as in_stock,
                   COALESCE(test_mode, false) as test_mode,
                   duration, level, features, logo, original_price,
                   COALESCE(popular, false) as popular,
                   students_count, brochure_link,
                   COALESCE(pricing_type, 'fixed') as pricing_type
            FROM zecurx_admin.plans 
            ${all ? '' : 'WHERE active = true'}
            ORDER BY created_at DESC
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
