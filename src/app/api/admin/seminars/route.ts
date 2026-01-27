import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { Seminar } from '@/types/seminar';

export async function GET(request: NextRequest) {
    const authResult = await requirePermission('seminars', 'read', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        let sql = `
            SELECT 
                s.*,
                COUNT(r.id) FILTER (WHERE r.email_verified = true) as registration_count,
                COUNT(r.id) FILTER (WHERE r.attended = true) as attended_count
            FROM seminar.seminars s
            LEFT JOIN seminar.registrations r ON r.seminar_id = s.id
        `;

        const params: string[] = [];
        if (status) {
            sql += ` WHERE s.status = $1`;
            params.push(status);
        }

        sql += ` GROUP BY s.id ORDER BY s.created_at DESC`;

        const result = await query<Seminar & { registration_count: string; attended_count: string }>(
            sql,
            params
        );

        const seminars = result.rows.map(row => ({
            ...row,
            registration_count: parseInt(row.registration_count) || 0,
            attended_count: parseInt(row.attended_count) || 0,
        }));

        return NextResponse.json({
            success: true,
            seminars,
        });

    } catch (error) {
        console.error('Failed to fetch seminars:', error);
        return NextResponse.json(
            { error: 'Failed to fetch seminars' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const authResult = await requirePermission('seminars', 'create', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const body = await request.json();

        const {
            title,
            description,
            date,
            time,
            duration,
            speakerName,
            speakerTitle,
            seminarType,
            topic,
            locationType,
            venueAddress,
            imageUrl,
            brochureUrl,
            maxAttendees,
            organizationName,
            contactPerson,
            contactEmail,
            contactPhone,
        } = body;

        if (!title || !date || !time || !duration || !speakerName || !organizationName || !contactPerson || !contactEmail) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const result = await query<Seminar>(
            `INSERT INTO seminar.seminars (
                title, description, date, time, duration,
                speaker_name, speaker_title, seminar_type, topic,
                location_type, venue_address, image_url, brochure_url, max_attendees,
                organization_name, contact_person, contact_email, contact_phone,
                status
            ) VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9,
                $10, $11, $12, $13, $14,
                $15, $16, $17, $18,
                'pending'
            ) RETURNING *`,
            [
                title,
                description || null,
                date,
                time,
                duration,
                speakerName,
                speakerTitle || null,
                seminarType || null,
                topic || null,
                locationType || 'onsite',
                venueAddress || null,
                imageUrl || null,
                brochureUrl || null,
                maxAttendees || null,
                organizationName,
                contactPerson,
                contactEmail,
                contactPhone || null,
            ]
        );

        return NextResponse.json({
            success: true,
            seminar: result.rows[0],
        });

    } catch (error) {
        console.error('Failed to create seminar:', error);
        return NextResponse.json(
            { error: 'Failed to create seminar' },
            { status: 500 }
        );
    }
}
