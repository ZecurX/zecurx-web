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

// Deliberately shown lower than the true remaining count (never higher) to create urgency.
// Tune this single constant if the business wants a different ratio.
const SEAT_DISPLAY_FACTOR = 0.6;

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

        const slots = result.rows.map((row) => {
            const actualRemaining = Math.max(0, row.capacity - row.seats_booked);
            const displayRemaining = actualRemaining === 0
                ? 0
                : Math.max(1, Math.min(actualRemaining, Math.ceil(actualRemaining * SEAT_DISPLAY_FACTOR)));

            return {
                id: row.id,
                name: row.name,
                startDate: row.start_date,
                seatsRemaining: displayRemaining,
            };
        });

        return NextResponse.json({ slots });
    } catch (error) {
        console.error('Failed to fetch course slots:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
