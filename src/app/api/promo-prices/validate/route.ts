import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface ValidatePromoPriceResponse {
    valid: boolean;
    promoPrice?: number;
    promoCode?: string;
    planId?: string;
    planName?: string;
    originalPrice?: number;
    error?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { planId, promoPrice, promoCode } = body;

        if (!planId) {
            return NextResponse.json<ValidatePromoPriceResponse>({
                valid: false,
                error: 'Plan ID is required'
            });
        }

        if (!promoPrice && !promoCode) {
            return NextResponse.json<ValidatePromoPriceResponse>({
                valid: false,
                error: 'Promo code or price is required'
            });
        }

        const planResult = await query(`
            SELECT id, name, price, type FROM zecurx_admin.plans 
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

        if (promoCode) {
            const promoResult = await query(`
                SELECT pp.* FROM zecurx_admin.promo_prices pp
                WHERE pp.promo_code = $1
                AND pp.is_active = true
                AND (pp.valid_until IS NULL OR pp.valid_until > NOW())
                AND pp.valid_from <= NOW()
                AND (pp.max_uses IS NULL OR pp.current_uses < pp.max_uses)
                AND (
                    pp.plan_id = $2 
                    OR ($3 ILIKE pp.plan_name_pattern AND pp.plan_name_pattern IS NOT NULL)
                )
                LIMIT 1
            `, [promoCode.toUpperCase(), planId, plan.name]);

            if (promoResult.rows.length === 0) {
                return NextResponse.json<ValidatePromoPriceResponse>({
                    valid: false,
                    error: 'Invalid or expired promo code'
                });
            }

            const promo = promoResult.rows[0];
            const discountedPrice = parseFloat(promo.min_price);

            return NextResponse.json<ValidatePromoPriceResponse>({
                valid: true,
                promoPrice: discountedPrice,
                promoCode: promo.promo_code,
                planId: plan.id,
                planName: plan.name,
                originalPrice
            });
        }

        const price = parseFloat(promoPrice);
        if (isNaN(price) || price <= 0) {
            return NextResponse.json<ValidatePromoPriceResponse>({
                valid: false,
                error: 'Invalid price'
            });
        }

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
            SELECT pp.* FROM zecurx_admin.promo_prices pp
            WHERE pp.is_active = true
            AND (pp.valid_until IS NULL OR pp.valid_until > NOW())
            AND pp.valid_from <= NOW()
            AND $1 >= pp.min_price 
            AND $1 <= pp.max_price
            AND (pp.max_uses IS NULL OR pp.current_uses < pp.max_uses)
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
            promoCode: promoResult.rows[0].promo_code,
            planId: plan.id,
            planName: plan.name,
            originalPrice
        });

    } catch (error) {
        console.error('Error validating promo:', error);
        return NextResponse.json<ValidatePromoPriceResponse>({
            valid: false,
            error: 'Failed to validate promo'
        });
    }
}
