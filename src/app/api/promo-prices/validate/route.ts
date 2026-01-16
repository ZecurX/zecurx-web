import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface ValidatePromoPriceResponse {
    valid: boolean;
    promoPrice?: number;
    planId?: string;
    planName?: string;
    originalPrice?: number;
    error?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { planId, promoPrice } = body;

        if (!planId || promoPrice === undefined || promoPrice === null) {
            return NextResponse.json<ValidatePromoPriceResponse>({
                valid: false,
                error: 'Plan ID and promo price are required'
            });
        }

        const price = parseFloat(promoPrice);
        if (isNaN(price) || price <= 0) {
            return NextResponse.json<ValidatePromoPriceResponse>({
                valid: false,
                error: 'Invalid price'
            });
        }

        const planResult = await query(`
            SELECT id, name, price, type FROM public.plans 
            WHERE id = $1 AND active = true
        `, [planId]);

        if (planResult.rows.length === 0) {
            return NextResponse.json<ValidatePromoPriceResponse>({
                valid: false,
                error: 'Plan not found or inactive'
            });
        }

        const plan = planResult.rows[0];
        const originalPrice = parseFloat(plan.price);

        if (Math.abs(price - originalPrice) < 0.01) {
            return NextResponse.json<ValidatePromoPriceResponse>({
                valid: true,
                promoPrice: price,
                planId: plan.id,
                planName: plan.name,
                originalPrice
            });
        }

        const promoResult = await query(`
            SELECT pp.* FROM public.promo_prices pp
            WHERE pp.is_active = true
            AND (pp.valid_until IS NULL OR pp.valid_until > NOW())
            AND pp.valid_from <= NOW()
            AND $1 >= pp.min_price 
            AND $1 <= pp.max_price
            AND (
                pp.plan_id = $2 
                OR ($3 ILIKE pp.plan_name_pattern AND pp.plan_name_pattern IS NOT NULL)
            )
            LIMIT 1
        `, [price, planId, plan.name]);

        if (promoResult.rows.length === 0) {
            return NextResponse.json<ValidatePromoPriceResponse>({
                valid: false,
                error: 'Price not allowed for this plan'
            });
        }

        return NextResponse.json<ValidatePromoPriceResponse>({
            valid: true,
            promoPrice: price,
            planId: plan.id,
            planName: plan.name,
            originalPrice
        });

    } catch (error) {
        console.error('Error validating promo price:', error);
        return NextResponse.json<ValidatePromoPriceResponse>({
            valid: false,
            error: 'Failed to validate promo price'
        });
    }
}
