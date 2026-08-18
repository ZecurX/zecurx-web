import { NextRequest, NextResponse } from 'next/server';
import { getRazorpay, amountToPaise, CURRENCY } from '@/lib/razorpay';
import { query } from '@/lib/db';
import { checkPaymentRateLimit, getClientIp } from '@/lib/rate-limit';
import { CourseBooking, remainingBalance } from '@/lib/course-bookings';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const clientIp = getClientIp(request);
        const rateLimitResult = await checkPaymentRateLimit(clientIp);
        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        const { token } = await params;

        const result = await query<CourseBooking & { course_name: string }>(
            `SELECT cb.*, p.name as course_name
             FROM zecurx_admin.course_bookings cb
             JOIN plans p ON p.id = cb.plan_id
             WHERE cb.booking_token = $1`,
            [token]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        const booking = result.rows[0];

        if (booking.status === 'fully_paid') {
            return NextResponse.json({ error: 'This booking is already fully paid' }, { status: 400 });
        }
        if (booking.status !== 'slot_booked') {
            return NextResponse.json({ error: 'This booking cannot accept a balance payment' }, { status: 400 });
        }

        const remaining = remainingBalance(booking);
        if (remaining <= 0) {
            return NextResponse.json({ error: 'No remaining balance' }, { status: 400 });
        }

        const order = await getRazorpay().orders.create({
            amount: amountToPaise(remaining),
            currency: CURRENCY,
            receipt: `balance_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substring(2, 6)}`,
            notes: {
                type: 'course_booking_balance',
                bookingId: booking.id,
                token,
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            courseName: booking.course_name,
        });
    } catch (error) {
        console.error('Error creating balance order:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: `Failed to create balance order: ${errorMessage}` },
            { status: 500 }
        );
    }
}
