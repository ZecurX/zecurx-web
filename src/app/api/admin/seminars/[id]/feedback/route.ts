import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { SeminarFeedback } from '@/types/seminar';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: seminarId } = await params;

        const result = await query<SeminarFeedback>(
            `SELECT * FROM seminar.feedback 
             WHERE seminar_id = $1 
             ORDER BY submitted_at DESC`,
            [seminarId]
        );

        return NextResponse.json({
            success: true,
            feedback: result.rows,
        });
    } catch (error) {
        console.error('Failed to fetch seminar feedback:', error);
        return NextResponse.json(
            { error: 'Failed to fetch feedback' },
            { status: 500 }
        );
    }
}
