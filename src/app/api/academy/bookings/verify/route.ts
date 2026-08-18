import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query } from '@/lib/db';
import { confirmDepositPayment, sendBookingConfirmationEmail, sendFullPaymentEmail, DEPOSIT_AMOUNT } from '@/lib/course-bookings';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        const isDevMode = process.env.NODE_ENV === 'development';

        if (!isDevMode && (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)) {
            return NextResponse.json(
                { success: false, error: 'Missing required payment verification fields' },
                { status: 400 }
            );
        }

        if (!isDevMode) {
            const secret = process.env.RAZORPAY_KEY_SECRET;
            if (!secret) {
                return NextResponse.json(
                    { success: false, error: 'Payment verification configuration error' },
                    { status: 500 }
                );
            }

            const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
            const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

            if (expectedSignature !== razorpay_signature) {
                return NextResponse.json(
                    { success: false, error: 'Payment verification failed - invalid signature' },
                    { status: 400 }
                );
            }
        }

        let notes: Record<string, string> | undefined;
        let amountInRupees = DEPOSIT_AMOUNT;

        if (isDevMode && body.metadata) {
            notes = body.metadata;
        } else {
            const { getRazorpay } = await import('@/lib/razorpay');
            const order = await getRazorpay().orders.fetch(razorpay_order_id);
            if (!order) {
                return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
            }
            notes = order.notes as Record<string, string> | undefined;
            amountInRupees = Number(order.amount) / 100;
        }

        if (!notes || (notes.type !== 'course_booking_deposit' && notes.type !== 'course_booking_full')) {
            return NextResponse.json({ success: false, error: 'Invalid booking order' }, { status: 400 });
        }

        const result = await confirmDepositPayment({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            amount: amountInRupees,
            notes: {
                batchId: notes.batchId,
                planId: notes.planId,
                name: notes.name,
                email: notes.email,
                phone: notes.phone,
                paymentOption: notes.paymentOption,
                referralCode: notes.referralCode || undefined,
                partnerReferralCode: notes.partnerReferralCode || undefined,
                isPartnerReferral: notes.isPartnerReferral,
                partnerReferralId: notes.partnerReferralId || undefined,
                discountType: notes.discountType || undefined,
                discountValue: notes.discountValue || undefined,
                discountAmount: notes.discountAmount || undefined,
            },
        });

        if ('error' in result) {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }

        const planResult = await query<{ name: string }>('SELECT name FROM plans WHERE id = $1', [result.booking.plan_id]);
        const courseName = planResult.rows[0]?.name || 'Course';
        const discountAmount = parseFloat(String(result.booking.discount_amount)) || 0;
        const couponCode = result.booking.referral_code || result.booking.partner_referral_code || null;

        if (result.booking.status === 'fully_paid') {
            await sendFullPaymentEmail({
                email: result.booking.customer_email,
                name: result.booking.customer_name || '',
                courseName,
                amountPaid: parseFloat(String(result.booking.amount_paid)),
                discountAmount,
                couponCode,
            });
        } else {
            const batchResult = await query<{ name: string }>('SELECT name FROM zecurx_admin.course_batches WHERE id = $1', [result.booking.batch_id]);
            await sendBookingConfirmationEmail({
                email: result.booking.customer_email,
                name: result.booking.customer_name || '',
                courseName,
                batchName: batchResult.rows[0]?.name || '',
                depositAmount: parseFloat(String(result.booking.deposit_amount)),
                totalAmount: parseFloat(String(result.booking.total_amount)),
                discountAmount,
                couponCode,
                bookingToken: result.booking.booking_token,
            });
        }

        return NextResponse.json({
            success: true,
            bookingToken: result.booking.booking_token,
            status: result.booking.status,
        });
    } catch (error) {
        console.error('Error verifying booking payment:', error);
        return NextResponse.json(
            { success: false, error: 'Payment verification failed. Please contact support.' },
            { status: 500 }
        );
    }
}
