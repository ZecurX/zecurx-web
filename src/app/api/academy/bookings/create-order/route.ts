import { NextRequest, NextResponse } from 'next/server';
import validator from 'validator';
import { getRazorpay, amountToPaise, CURRENCY } from '@/lib/razorpay';
import { query } from '@/lib/db';
import { checkPaymentRateLimit, getClientIp } from '@/lib/rate-limit';
import { validateDiscount } from '@/lib/discount-validation';
import { DEPOSIT_AMOUNT } from '@/lib/course-bookings';

export async function POST(request: NextRequest) {
    try {
        const clientIp = getClientIp(request);
        const rateLimitResult = await checkPaymentRateLimit(clientIp);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const {
            batchId, name, email, phone,
            paymentOption: rawPaymentOption,
            referralCode, partnerReferralCode,
            discountAmount: clientDiscountAmount = 0,
        } = body;
        const paymentOption: 'deposit' | 'full' = rawPaymentOption === 'full' ? 'full' : 'deposit';

        if (!batchId || !name || !email || !phone) {
            return NextResponse.json(
                { error: 'Missing required fields: batchId, name, email, phone' },
                { status: 400 }
            );
        }

        if (!validator.isEmail(String(email))) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        const batchResult = await query<{
            id: string;
            plan_id: string;
            name: string;
            capacity: number;
            seats_booked: number;
            status: string;
            plan_name: string;
            price: string;
            pricing_type: string;
        }>(
            `SELECT cb.id, cb.plan_id, cb.name, cb.capacity, cb.seats_booked, cb.status,
                    p.name as plan_name, p.price, COALESCE(p.pricing_type, 'fixed') as pricing_type
             FROM zecurx_admin.course_batches cb
             JOIN plans p ON p.id = cb.plan_id
             WHERE cb.id = $1`,
            [batchId]
        );

        if (batchResult.rows.length === 0) {
            return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
        }

        const batch = batchResult.rows[0];

        if (batch.status !== 'active') {
            return NextResponse.json({ error: 'This batch is no longer open for booking' }, { status: 400 });
        }

        if (batch.pricing_type === 'institutional') {
            return NextResponse.json({ error: 'This course is not available for online booking' }, { status: 400 });
        }

        if (batch.seats_booked >= batch.capacity) {
            return NextResponse.json({ error: 'This batch is fully booked' }, { status: 409 });
        }

        const planPrice = parseFloat(batch.price);

        // Discount applies to the remaining balance in the deposit path (never the deposit
        // itself), or to the full fee in the full-payment path.
        const discountBaseAmount = paymentOption === 'full' ? planPrice : planPrice - DEPOSIT_AMOUNT;

        let verifiedDiscount = 0;
        let discountType: string | null = null;
        let discountValue: number | null = null;
        let isPartnerReferral = false;
        let partnerReferralId: string | null = null;

        if (clientDiscountAmount > 0 && (referralCode || partnerReferralCode)) {
            const discountResult = await validateDiscount(
                discountBaseAmount,
                clientDiscountAmount,
                referralCode || null,
                partnerReferralCode || null
            );

            if (!discountResult.valid) {
                return NextResponse.json(
                    { error: discountResult.error || 'Invalid or expired coupon code' },
                    { status: 400 }
                );
            }

            verifiedDiscount = discountResult.verifiedDiscount;

            if (referralCode) {
                const codeRow = await query<{ discount_type: string; discount_value: string }>(
                    `SELECT discount_type, discount_value FROM public.referral_codes WHERE code = $1`,
                    [String(referralCode).toUpperCase().trim()]
                );
                if (codeRow.rows.length > 0) {
                    discountType = codeRow.rows[0].discount_type;
                    discountValue = parseFloat(codeRow.rows[0].discount_value);
                }
            } else if (partnerReferralCode) {
                isPartnerReferral = true;
                const codeRow = await query<{ id: string; user_discount_type: string; user_discount_value: string }>(
                    `SELECT id, user_discount_type, user_discount_value FROM public.partner_referrals WHERE code = $1`,
                    [String(partnerReferralCode).toUpperCase().trim()]
                );
                if (codeRow.rows.length > 0) {
                    partnerReferralId = codeRow.rows[0].id;
                    discountType = codeRow.rows[0].user_discount_type;
                    discountValue = parseFloat(codeRow.rows[0].user_discount_value);
                }
            }
        }

        const chargeAmount = paymentOption === 'full'
            ? Math.max(0, planPrice - verifiedDiscount)
            : DEPOSIT_AMOUNT;

        const sanitizedName = validator.escape(String(name).trim()).substring(0, 255);
        const sanitizedEmail = validator.normalizeEmail(String(email)) || String(email);
        const sanitizedPhone = String(phone).replace(/[^0-9+\-\s()]/g, '').substring(0, 20);

        const order = await getRazorpay().orders.create({
            amount: amountToPaise(chargeAmount),
            currency: CURRENCY,
            receipt: `booking_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substring(2, 6)}`,
            notes: {
                type: paymentOption === 'full' ? 'course_booking_full' : 'course_booking_deposit',
                batchId: batch.id,
                planId: batch.plan_id,
                name: sanitizedName,
                email: sanitizedEmail,
                phone: sanitizedPhone,
                paymentOption,
                referralCode: referralCode || '',
                partnerReferralCode: partnerReferralCode || '',
                isPartnerReferral: isPartnerReferral ? 'true' : 'false',
                partnerReferralId: partnerReferralId || '',
                discountType: discountType || '',
                discountValue: discountValue != null ? String(discountValue) : '',
                discountAmount: String(verifiedDiscount),
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            courseName: batch.plan_name,
            batchName: batch.name,
            paymentOption,
            depositAmount: DEPOSIT_AMOUNT,
            totalAmount: planPrice,
            discountAmount: verifiedDiscount,
            chargeAmount,
        });
    } catch (error) {
        console.error('Error creating booking order:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: `Failed to create booking order: ${errorMessage}` },
            { status: 500 }
        );
    }
}
