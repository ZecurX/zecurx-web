import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Seminar } from '@/types/seminar';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const result = await query<Seminar>(
            `SELECT 
                s.*,
                COUNT(r.id) FILTER (WHERE r.email_verified = true) as registration_count,
                COUNT(r.id) FILTER (WHERE r.attended = true) as attended_count
            FROM seminar.seminars s
            LEFT JOIN seminar.registrations r ON r.seminar_id = s.id
            WHERE s.id = $1 AND s.status = 'approved'
            GROUP BY s.id`,
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Seminar not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            seminar: result.rows[0],
        });

    } catch (error) {
        console.error('Failed to fetch seminar:', error);
        return NextResponse.json(
            { error: 'Failed to fetch seminar' },
            { status: 500 }
        );
    }
}
