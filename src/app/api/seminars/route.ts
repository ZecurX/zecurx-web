import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { PublicSeminar } from '@/types/seminar';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const includeAll = searchParams.get('all') === 'true';

        let sql = `
            SELECT 
                s.id, s.title, s.description, s.date, s.time, s.duration,
                s.speaker_name, s.speaker_title, s.seminar_type,
                s.location_type, s.venue_address, s.image_url, s.brochure_url,
                s.organization_name, s.registration_enabled, s.certificate_enabled,
                s.max_attendees,
                COUNT(r.id) FILTER (WHERE r.email_verified = true) as registration_count
            FROM seminar.seminars s
            LEFT JOIN seminar.registrations r ON r.seminar_id = s.id
            WHERE s.status = 'approved'
        `;

        // FIX 1: Use CURRENT_DATE instead of NOW()
        if (!includeAll) {
            sql += ` AND s.date >= CURRENT_DATE`;
        }

        sql += `
            GROUP BY s.id
            ORDER BY s.date ASC
        `;

        const result = await query<PublicSeminar & { registration_count: string }>(sql);

        const now = new Date();

        const seminars = result.rows.map(row => {
            // FIX 2: Force local time interpretation to avoid timezone shift
            const seminarDate = new Date(row.date + 'T00:00:00');

            return {
                ...row,
                registration_count: parseInt(row.registration_count) || 0,

                // FIX 3: Correct comparison
                registration_enabled:
                    seminarDate < now ? false : row.registration_enabled,
            };
        });

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