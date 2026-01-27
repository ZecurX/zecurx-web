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
        const { registrationId, attended } = body;

        if (!registrationId || typeof attended !== 'boolean') {
            return NextResponse.json(
                { error: 'Registration ID and attended status are required' },
                { status: 400 }
            );
        }

        const result = await query<SeminarRegistration>(
            `UPDATE seminar.registrations 
             SET attended = $1
             WHERE id = $2 AND seminar_id = $3
             RETURNING *`,
            [attended, registrationId, seminarId]
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
