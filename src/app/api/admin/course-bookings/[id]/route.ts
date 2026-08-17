import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { RESOURCES, ACTIONS } from '@/types/auth';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requirePermission(RESOURCES.COURSE_BOOKINGS, ACTIONS.UPDATE, request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id } = await params;
        const body = await request.json();

        if (typeof body.courseAccessEnabled !== 'boolean') {
            return NextResponse.json({ error: 'courseAccessEnabled (boolean) is required' }, { status: 400 });
        }

        const result = await query(
            `UPDATE zecurx_admin.course_bookings
             SET course_access_enabled = $1, updated_at = NOW()
             WHERE id = $2
             RETURNING *`,
            [body.courseAccessEnabled, id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, booking: result.rows[0] });
    } catch (error) {
        console.error('Failed to update course booking:', error);
        return NextResponse.json({ error: 'Failed to update course booking' }, { status: 500 });
    }
}
