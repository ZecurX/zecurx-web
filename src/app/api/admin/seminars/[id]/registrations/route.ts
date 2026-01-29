import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { SeminarRegistration } from '@/types/seminar';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requirePermission('seminars', 'read', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id: seminarId } = await params;

        const result = await query<SeminarRegistration>(
            `SELECT * FROM seminar.registrations 
             WHERE seminar_id = $1
             ORDER BY registered_at DESC`,
            [seminarId]
        );

        return NextResponse.json({
            success: true,
            registrations: result.rows,
        });

    } catch (error) {
        console.error('Failed to fetch registrations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch registrations' },
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
        const { id: seminarId } = await params;
        const body = await request.json();
        const { registrationId, ...updateFields } = body;

        if (!registrationId) {
            return NextResponse.json(
                { error: 'Registration ID is required' },
                { status: 400 }
            );
        }

        const allowedFields = [
            'full_name', 'email', 'phone', 'college_name', 
            'year', 'city_state', 'attended', 'email_verified', 'is_retroactive'
        ];

        const updates: string[] = [];
        const values: unknown[] = [];
        let paramIndex = 1;

        for (const [key, value] of Object.entries(updateFields)) {
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

        values.push(registrationId, seminarId);

        const result = await query<SeminarRegistration>(
            `UPDATE seminar.registrations 
             SET ${updates.join(', ')}
             WHERE id = $${paramIndex} AND seminar_id = $${paramIndex + 1}
             RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Registration not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            registration: result.rows[0],
        });

    } catch (error) {
        console.error('Failed to update registration:', error);
        return NextResponse.json(
            { error: 'Failed to update registration' },
            { status: 500 }
        );
    }
}
