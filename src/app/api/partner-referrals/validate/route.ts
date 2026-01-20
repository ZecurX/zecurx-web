import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ValidatePartnerReferralResponse } from '@/types/partner-referral-types';
import { checkValidateRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
    try {
        const clientIp = getClientIp(request);
        const rateLimitResult = await checkValidateRateLimit(clientIp);
        
        if (!rateLimitResult.success) {
            return NextResponse.json<ValidatePartnerReferralResponse>({
                valid: false,
                is_partner_referral: false,
                error: 'Too many requests. Please try again later.'
            }, { status: 429 });
        }

        const body = await request.json();
        const { code, order_amount, customer_email } = body;

        if (!code) {
            return NextResponse.json<ValidatePartnerReferralResponse>({
                valid: false,
                is_partner_referral: false,
                error: 'Referral code is required'
            });
        }

        const orderAmount = parseFloat(order_amount) || 0;
        const codeUpper = code.toUpperCase().trim();

        const result = await query(`
            SELECT * FROM partner_referrals 
            WHERE code = $1 AND is_active = true
        `, [codeUpper]);

        if (result.rows.length === 0) {
            return NextResponse.json<ValidatePartnerReferralResponse>({
                valid: false,
                is_partner_referral: false,
                error: 'Invalid referral code'
            });
        }

        const partnerReferral = result.rows[0];

        if (partnerReferral.valid_until && new Date(partnerReferral.valid_until) < new Date()) {
            return NextResponse.json<ValidatePartnerReferralResponse>({
                valid: false,
                is_partner_referral: true,
                error: 'This code has expired'
            });
        }

        if (new Date(partnerReferral.valid_from) > new Date()) {
            return NextResponse.json<ValidatePartnerReferralResponse>({
                valid: false,
                is_partner_referral: true,
                error: 'This code is not yet valid'
            });
        }

        if (partnerReferral.max_uses && partnerReferral.current_uses >= partnerReferral.max_uses) {
            return NextResponse.json<ValidatePartnerReferralResponse>({
                valid: false,
                is_partner_referral: true,
                error: 'This code has reached its usage limit'
            });
        }

        if (orderAmount < partnerReferral.min_order_amount) {
            return NextResponse.json<ValidatePartnerReferralResponse>({
                valid: false,
                is_partner_referral: true,
                error: `Minimum order amount is ₹${partnerReferral.min_order_amount}`
            });
        }

        if (customer_email) {
            const usageCheck = await query(`
                SELECT id FROM partner_referral_usages 
                WHERE partner_referral_id = $1 AND customer_email = $2
            `, [partnerReferral.id, customer_email.toLowerCase().trim()]);

            if (usageCheck.rows.length > 0) {
                return NextResponse.json<ValidatePartnerReferralResponse>({
                    valid: false,
                    is_partner_referral: true,
                    error: 'You have already used a partner referral code'
                });
            }
        }

        let discountAmount: number;
        if (partnerReferral.user_discount_type === 'percentage') {
            discountAmount = (orderAmount * partnerReferral.user_discount_value) / 100;
            if (partnerReferral.max_user_discount && discountAmount > partnerReferral.max_user_discount) {
                discountAmount = partnerReferral.max_user_discount;
            }
        } else {
            discountAmount = partnerReferral.user_discount_value;
        }

        discountAmount = Math.min(discountAmount, orderAmount);
        const finalAmount = orderAmount - discountAmount;

        return NextResponse.json<ValidatePartnerReferralResponse>({
            valid: true,
            is_partner_referral: true,
            code: partnerReferral.code,
            user_discount_type: partnerReferral.user_discount_type,
            user_discount_value: partnerReferral.user_discount_value,
            discount_amount: discountAmount,
            final_amount: finalAmount,
            partner_name: partnerReferral.partner_name
        });

    } catch (error) {
        console.error('Error validating partner referral code:', error);
        return NextResponse.json<ValidatePartnerReferralResponse>({
            valid: false,
            is_partner_referral: false,
            error: 'Failed to validate referral code'
        });
    }
}
