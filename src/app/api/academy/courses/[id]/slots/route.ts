import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface DBBatch {
    id: string;
    name: string;
    start_date: string;
    end_date: string | null;
    capacity: number;
    seats_booked: number;
}

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const result = await query<DBBatch>(
            `SELECT id, name, start_date, end_date, capacity, seats_booked
             FROM zecurx_admin.course_batches
             WHERE plan_id = $1 AND status = 'active'
             ORDER BY start_date ASC`,
            [id]
        );

        const slots = result.rows.map((row) => ({
            id: row.id,
            name: row.name,
            startDate: row.start_date,
            endDate: row.end_date,
            capacity: row.capacity,
            seatsRemaining: Math.max(0, row.capacity - row.seats_booked),
        }));

        return NextResponse.json({ slots });
    } catch (error) {
        console.error('Failed to fetch course slots:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
