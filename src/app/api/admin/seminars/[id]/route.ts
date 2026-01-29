import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { Seminar } from '@/types/seminar';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requirePermission('seminars', 'read', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id } = await params;

        const result = await query<Seminar>(
            `SELECT 
                s.*,
                COUNT(r.id) FILTER (WHERE r.email_verified = true) as registration_count,
                COUNT(r.id) FILTER (WHERE r.attended = true) as attended_count
            FROM seminar.seminars s
            LEFT JOIN seminar.registrations r ON r.seminar_id = s.id
            WHERE s.id = $1
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

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requirePermission('seminars', 'update', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id } = await params;
        const body = await request.json();

        const allowedFields = [
            'title', 'description', 'date', 'time', 'duration',
            'speaker_name', 'speaker_title', 'seminar_type', 'topic',
            'location_type', 'venue_address', 'image_url', 'brochure_url',
            'max_attendees', 'registration_enabled', 'certificate_enabled', 'status',
            'organization_name', 'contact_person', 'contact_email', 'contact_phone',
            'additional_notes', 'rejection_reason'
        ];

        const updates: string[] = [];
        const values: unknown[] = [];
        let paramIndex = 1;

        for (const [key, value] of Object.entries(body)) {
            const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            if (allowedFields.includes(dbKey)) {
                updates.push(`${dbKey} = $${paramIndex}`);
                values.push(value);
                paramIndex++;
            }
        }

        if (updates.length === 0) {
            return NextResponse.json(
                { error: 'No valid fields to update' },
                { status: 400 }
            );
        }

        values.push(id);

        const result = await query<Seminar>(
            `UPDATE seminar.seminars 
             SET ${updates.join(', ')}, updated_at = NOW()
             WHERE id = $${paramIndex}
             RETURNING *`,
            values
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
        console.error('Failed to update seminar:', error);
        return NextResponse.json(
            { error: 'Failed to update seminar' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requirePermission('seminars', 'delete', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id } = await params;

        const result = await query(
            `DELETE FROM seminar.seminars WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { error: 'Seminar not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Seminar deleted successfully',
        });

    } catch (error) {
        console.error('Failed to delete seminar:', error);
        return NextResponse.json(
            { error: 'Failed to delete seminar' },
            { status: 500 }
        );
    }
}
