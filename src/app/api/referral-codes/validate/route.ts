import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ValidateReferralCodeResponse } from '@/types/referral-types';
import { checkValidateRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
    try {
        const clientIp = getClientIp(request);
        const rateLimitResult = await checkValidateRateLimit(clientIp);

        if (!rateLimitResult.success) {
            return NextResponse.json<ValidateReferralCodeResponse>({
                valid: false,
                error: 'Too many requests. Please try again later.'
            }, { status: 429 });
        }

        const body = await request.json();
        const { code, order_amount } = body;

        if (!code) {
            return NextResponse.json<ValidateReferralCodeResponse>({
                valid: false,
                error: 'Referral code is required'
            });
        }

        const orderAmount = parseFloat(order_amount) || 0;
        const normalizedCode = code.toUpperCase().trim();

        // First, check regular referral codes
        const regularResult = await query(`
            SELECT * FROM public.referral_codes 
            WHERE code = $1 AND is_active = true
        `, [normalizedCode]);

        if (regularResult.rows.length > 0) {
            return validateRegularReferralCode(regularResult.rows[0], orderAmount);
        }

        // If not found, check partner referral codes
        const partnerResult = await query(`
            SELECT * FROM public.partner_referrals 
            WHERE code = $1 AND is_active = true
        `, [normalizedCode]);

        if (partnerResult.rows.length > 0) {
            return validatePartnerReferralCode(partnerResult.rows[0], orderAmount);
        }

        // Code not found in either table
        return NextResponse.json<ValidateReferralCodeResponse>({
            valid: false,
            error: 'Invalid referral code'
        });

    } catch (error) {
        console.error('Error validating referral code:', error);
        return NextResponse.json<ValidateReferralCodeResponse>({
            valid: false,
            error: 'Failed to validate referral code'
        });
    }
}

// Validate regular referral code from referral_codes table
function validateRegularReferralCode(referralCode: any, orderAmount: number) {
    // Check if expired
    if (referralCode.valid_until && new Date(referralCode.valid_until) < new Date()) {
        return NextResponse.json<ValidateReferralCodeResponse>({
            valid: false,
            error: 'This code has expired'
        });
    }

    // Check if not yet valid
    if (new Date(referralCode.valid_from) > new Date()) {
        return NextResponse.json<ValidateReferralCodeResponse>({
            valid: false,
            error: 'This code is not yet valid'
        });
    }

    // Check max uses
    if (referralCode.max_uses && referralCode.current_uses >= referralCode.max_uses) {
        return NextResponse.json<ValidateReferralCodeResponse>({
            valid: false,
            error: 'This code has reached its usage limit'
        });
    }

    // Check minimum order amount
    if (orderAmount < referralCode.min_order_amount) {
        return NextResponse.json<ValidateReferralCodeResponse>({
            valid: false,
            error: `Minimum order amount is ₹${referralCode.min_order_amount}`
        });
    }

    // Calculate discount
    let discountAmount: number;
    if (referralCode.discount_type === 'percentage') {
        discountAmount = (orderAmount * referralCode.discount_value) / 100;
        // Apply max discount cap if set
        if (referralCode.max_discount && discountAmount > referralCode.max_discount) {
            discountAmount = referralCode.max_discount;
        }
    } else {
        discountAmount = referralCode.discount_value;
    }

    // Don't let discount exceed order amount
    discountAmount = Math.min(discountAmount, orderAmount);
    const finalAmount = orderAmount - discountAmount;

    return NextResponse.json<ValidateReferralCodeResponse>({
        valid: true,
        code: referralCode.code,
        discount_type: referralCode.discount_type,
        discount_value: referralCode.discount_value,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        isPartnerReferral: false
    });
}

// Validate partner referral code from partner_referrals table
function validatePartnerReferralCode(partnerCode: any, orderAmount: number) {
    // Check if expired
    if (partnerCode.valid_until && new Date(partnerCode.valid_until) < new Date()) {
        return NextResponse.json<ValidateReferralCodeResponse>({
            valid: false,
            error: 'This code has expired'
        });
    }

    // Check if not yet valid
    if (partnerCode.valid_from && new Date(partnerCode.valid_from) > new Date()) {
        return NextResponse.json<ValidateReferralCodeResponse>({
            valid: false,
            error: 'This code is not yet valid'
        });
    }

    // Check max uses
    if (partnerCode.max_uses && partnerCode.current_uses >= partnerCode.max_uses) {
        return NextResponse.json<ValidateReferralCodeResponse>({
            valid: false,
            error: 'This code has reached its usage limit'
        });
    }

    // Check minimum order amount
    if (orderAmount < (partnerCode.min_order_amount || 0)) {
        return NextResponse.json<ValidateReferralCodeResponse>({
            valid: false,
            error: `Minimum order amount is ₹${partnerCode.min_order_amount || 0}`
        });
    }

    // Calculate user discount (partner referrals use user_discount_type and user_discount_value)
    let discountAmount: number;
    if (partnerCode.user_discount_type === 'percentage') {
        discountAmount = (orderAmount * partnerCode.user_discount_value) / 100;
        // Apply max discount cap if set
        if (partnerCode.max_user_discount && discountAmount > partnerCode.max_user_discount) {
            discountAmount = partnerCode.max_user_discount;
        }
    } else {
        discountAmount = partnerCode.user_discount_value;
    }

    // Don't let discount exceed order amount
    discountAmount = Math.min(discountAmount, orderAmount);
    const finalAmount = orderAmount - discountAmount;

    return NextResponse.json<ValidateReferralCodeResponse>({
        valid: true,
        code: partnerCode.code,
        discount_type: partnerCode.user_discount_type,
        discount_value: partnerCode.user_discount_value,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        isPartnerReferral: true,
        partner_referral_id: partnerCode.id,
        partner_name: partnerCode.partner_name
    });
}
