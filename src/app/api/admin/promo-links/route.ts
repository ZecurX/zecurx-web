import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

interface PromoLink {
    id: string;
    plan_id: string | null;
    plan_name_pattern: string | null;
    min_price: number;
    max_price: number;
    promo_code: string;
    description: string | null;
    max_uses: number | null;
    current_uses: number;
    is_active: boolean;
    valid_from: string;
    valid_until: string | null;
    created_at: string;
}

function generatePromoCode(): string {
    return 'PROMO' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

export async function GET() {
    try {
        const result = await query<PromoLink>(`
            SELECT 
                pp.*,
                p.name as plan_name
            FROM zecurx_admin.promo_prices pp
            LEFT JOIN zecurx_admin.plans p ON pp.plan_id = p.id
            ORDER BY pp.created_at DESC
        `);

        return NextResponse.json({ promoLinks: result.rows });
    } catch (error) {
        console.error('Error fetching promo links:', error);
        return NextResponse.json(
            { error: 'Failed to fetch promo links' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            planId,
            planNamePattern,
            price,
            description,
            maxUses,
            validDays
        } = body;

        if (!price || price <= 0) {
            return NextResponse.json(
                { error: 'Valid price is required' },
                { status: 400 }
            );
        }

        if (!planId && !planNamePattern) {
            return NextResponse.json(
                { error: 'Either plan ID or plan name pattern is required' },
                { status: 400 }
            );
        }

        const promoCode = generatePromoCode();
        const validUntil = validDays 
            ? new Date(Date.now() + validDays * 24 * 60 * 60 * 1000).toISOString()
            : null;

        const result = await query<PromoLink>(`
            INSERT INTO zecurx_admin.promo_prices 
            (plan_id, plan_name_pattern, min_price, max_price, promo_code, description, max_uses, valid_until, is_active)
            VALUES ($1, $2, $3, $3, $4, $5, $6, $7, true)
            RETURNING *
        `, [
            planId || null,
            planNamePattern || null,
            price,
            promoCode,
            description || null,
            maxUses || null,
            validUntil
        ]);

        const promoLink = result.rows[0];
        
        let checkoutUrl = '';
        if (planId) {
            checkoutUrl = `/checkout?itemId=${planId}&type=internship&promoCode=${promoCode}`;
        }

        return NextResponse.json({
            success: true,
            promoLink,
            checkoutUrl,
            promoCode
        });
    } catch (error) {
        console.error('Error creating promo link:', error);
        return NextResponse.json(
            { error: 'Failed to create promo link' },
            { status: 500 }
        );
    }
}
