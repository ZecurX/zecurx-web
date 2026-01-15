import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { LeadNote } from '@/types/lead-types';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        if (!body.content || body.content.trim() === '') {
            return NextResponse.json(
                { error: 'Note content is required' },
                { status: 400 }
            );
        }

        const leadResult = await query(
            `SELECT id FROM student_leads WHERE id = $1`,
            [id]
        );

        if (leadResult.rows.length === 0) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        const noteResult = await query<LeadNote>(
            `INSERT INTO student_lead_notes (lead_id, content, created_by)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [id, body.content.trim(), body.created_by || null]
        );

        await query(
            `INSERT INTO student_lead_activities (lead_id, activity_type, description, performed_by)
             VALUES ($1, $2, $3, $4)`,
            [id, 'NOTE_ADDED', 'Note added to lead', body.created_by || null]
        );

        return NextResponse.json({ success: true, data: noteResult.rows[0] });
    } catch (error) {
        console.error('Error adding note:', error);
        return NextResponse.json(
            { error: 'Failed to add note' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const result = await query<LeadNote>(
            `SELECT * FROM student_lead_notes WHERE lead_id = $1 ORDER BY created_at DESC`,
            [id]
        );

        return NextResponse.json({ data: result.rows });
    } catch (error) {
        console.error('Error fetching notes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notes' },
            { status: 500 }
        );
    }
}
