import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCdnUrl } from '@/lib/cdn';

export const dynamic = 'force-dynamic';

interface DBPlan {
    id: string;
    name: string;
    price: string;
    description: string | null;
    duration: string | null;
    level: string | null;
    features: string[] | null;
    logo: string | null;
    original_price: string | null;
    popular: boolean;
    students_count: number | null;
    brochure_link: string | null;
    in_stock: boolean;
    pricing_type: string;
}

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const result = await query<DBPlan>(
            `SELECT id, name, price, description, duration, level, features,
                    logo, original_price, popular, students_count, brochure_link,
                    COALESCE(in_stock, true) as in_stock,
                    COALESCE(pricing_type, 'fixed') as pricing_type
             FROM plans
             WHERE id = $1 AND type = 'academy' AND active = true`,
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        const row = result.rows[0];
        const pricingType = row.pricing_type as 'fixed' | 'contact' | 'institutional';
        const price = parseFloat(row.price);
        const originalPrice = row.original_price ? parseFloat(row.original_price) : undefined;

        let displayPrice: number | string;
        if (pricingType === 'institutional') {
            displayPrice = 'Institution Only';
        } else if (pricingType === 'contact') {
            displayPrice = 'Contact for Pricing';
        } else {
            displayPrice = !isNaN(price) && price > 0 ? price : 'Contact for Pricing';
        }

        const course = {
            id: row.id,
            title: row.name,
            description: row.description || '',
            price: displayPrice,
            originalPrice: originalPrice && !isNaN(originalPrice) ? originalPrice : undefined,
            duration: row.duration || 'Custom',
            level: row.level || 'Beginner',
            features: row.features || [],
            popular: row.popular ?? false,
            logo: row.logo || undefined,
            students: row.students_count || undefined,
            brochureLink: row.brochure_link ? getCdnUrl(row.brochure_link) : undefined,
            inStock: row.in_stock ?? true,
            pricingType,
        };

        return NextResponse.json(course);
    } catch (error) {
        console.error('Failed to fetch course:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
