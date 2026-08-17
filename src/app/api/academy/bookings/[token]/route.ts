import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { computeBookingBadge, CourseBooking } from '@/lib/course-bookings';

export const dynamic = 'force-dynamic';

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;

        const result = await query<CourseBooking & { course_name: string; batch_name: string; batch_start_date: string }>(
            `SELECT cb.*, p.name as course_name, b.name as batch_name, b.start_date as batch_start_date
             FROM zecurx_admin.course_bookings cb
             JOIN plans p ON p.id = cb.plan_id
             JOIN zecurx_admin.course_batches b ON b.id = cb.batch_id
             WHERE cb.booking_token = $1`,
            [token]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        const booking = result.rows[0];

        return NextResponse.json({
            courseName: booking.course_name,
            batchName: booking.batch_name,
            batchStartDate: booking.batch_start_date,
            status: booking.status,
            badge: computeBookingBadge(booking),
            depositAmount: parseFloat(String(booking.deposit_amount)),
            totalAmount: parseFloat(String(booking.total_amount)),
            amountPaid: parseFloat(String(booking.amount_paid)),
            remainingBalance: Math.max(0, parseFloat(String(booking.total_amount)) - parseFloat(String(booking.amount_paid))),
            paymentDueAt: booking.payment_due_at,
            customerName: booking.customer_name,
            customerEmail: booking.customer_email,
        });
    } catch (error) {
        console.error('Failed to fetch booking:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
