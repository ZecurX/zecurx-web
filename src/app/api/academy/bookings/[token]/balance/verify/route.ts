import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query } from '@/lib/db';
import { confirmBalancePayment, sendFullPaymentEmail } from '@/lib/course-bookings';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;
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
        let amountInRupees = 0;

        if (isDevMode && body.metadata) {
            notes = body.metadata;
            amountInRupees = Number(body.metadata.amount) || 0;
        } else {
            const { getRazorpay } = await import('@/lib/razorpay');
            const order = await getRazorpay().orders.fetch(razorpay_order_id);
            if (!order) {
                return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
            }
            notes = order.notes as Record<string, string> | undefined;
            amountInRupees = Number(order.amount) / 100;
        }

        if (!notes || notes.type !== 'course_booking_balance' || notes.token !== token) {
            return NextResponse.json({ success: false, error: 'Invalid balance payment order' }, { status: 400 });
        }

        const result = await confirmBalancePayment({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            amount: amountInRupees,
            notes: { bookingId: notes.bookingId, token: notes.token },
        });

        if ('error' in result) {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }

        if (result.booking.status === 'fully_paid') {
            const planResult = await query<{ name: string }>('SELECT name FROM plans WHERE id = $1', [result.booking.plan_id]);
            await sendFullPaymentEmail({
                email: result.booking.customer_email,
                name: result.booking.customer_name || '',
                courseName: planResult.rows[0]?.name || 'Course',
            });
        }

        return NextResponse.json({ success: true, status: result.booking.status });
    } catch (error) {
        console.error('Error verifying balance payment:', error);
        return NextResponse.json(
            { success: false, error: 'Payment verification failed. Please contact support.' },
            { status: 500 }
        );
    }
}
