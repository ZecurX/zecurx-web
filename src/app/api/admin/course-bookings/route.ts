import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { RESOURCES, ACTIONS } from '@/types/auth';
import { computeBookingBadge, CourseBooking } from '@/lib/course-bookings';

type BookingRow = CourseBooking & { course_name: string; batch_name: string };

export async function GET(request: NextRequest) {
    const authResult = await requirePermission(RESOURCES.COURSE_BOOKINGS, ACTIONS.READ, request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');

        let sql = `
            SELECT cb.*, p.name as course_name, b.name as batch_name
            FROM zecurx_admin.course_bookings cb
            JOIN plans p ON p.id = cb.plan_id
            JOIN zecurx_admin.course_batches b ON b.id = cb.batch_id
        `;
        const params: string[] = [];
        if (search) {
            sql += ` WHERE cb.customer_name ILIKE $1 OR cb.customer_email ILIKE $1 OR p.name ILIKE $1`;
            params.push(`%${search}%`);
        }
        sql += ` ORDER BY cb.created_at DESC`;

        const result = await query<BookingRow>(sql, params);

        const bookings = result.rows.map((row) => ({
            id: row.id,
            customerName: row.customer_name,
            customerEmail: row.customer_email,
            customerPhone: row.customer_phone,
            courseName: row.course_name,
            batchName: row.batch_name,
            status: row.status,
            badge: computeBookingBadge(row),
            paymentOption: row.payment_option,
            depositAmount: parseFloat(String(row.deposit_amount)),
            totalAmount: parseFloat(String(row.total_amount)),
            amountPaid: parseFloat(String(row.amount_paid)),
            discountAmount: parseFloat(String(row.discount_amount)) || 0,
            couponCode: row.referral_code || row.partner_referral_code || null,
            paymentDueAt: row.payment_due_at,
            courseAccessEnabled: row.course_access_enabled,
            createdAt: row.created_at,
        }));

        return NextResponse.json({ bookings });
    } catch (error) {
        console.error('Failed to fetch course bookings:', error);
        return NextResponse.json({ error: 'Failed to fetch course bookings' }, { status: 500 });
    }
}
