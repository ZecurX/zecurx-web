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
        const { name, startDate, endDate, capacity, status } = body;

        const updates: string[] = [];
        const values: unknown[] = [];
        let idx = 1;

        if (name !== undefined) { updates.push(`name = $${idx++}`); values.push(name); }
        if (startDate !== undefined) { updates.push(`start_date = $${idx++}`); values.push(startDate); }
        if (endDate !== undefined) { updates.push(`end_date = $${idx++}`); values.push(endDate); }
        if (capacity !== undefined) { updates.push(`capacity = $${idx++}`); values.push(capacity); }
        if (status !== undefined) { updates.push(`status = $${idx++}`); values.push(status); }

        if (updates.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        updates.push(`updated_at = NOW()`);
        values.push(id);

        const result = await query(
            `UPDATE zecurx_admin.course_batches SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, batch: result.rows[0] });
    } catch (error) {
        console.error('Failed to update course batch:', error);
        return NextResponse.json({ error: 'Failed to update course batch' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requirePermission(RESOURCES.COURSE_BOOKINGS, ACTIONS.DELETE, request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id } = await params;
        const result = await query('DELETE FROM zecurx_admin.course_batches WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete course batch:', error);
        return NextResponse.json({ error: 'Failed to delete course batch. It may have existing bookings.' }, { status: 500 });
    }
}
