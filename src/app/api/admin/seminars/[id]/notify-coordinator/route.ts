import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { Seminar } from '@/types/seminar';
import { sendCoordinatorCertificateAlert } from '@/lib/certificate';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requirePermission('seminars', 'update', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id: seminarId } = await params;

        const result = await query<Seminar>(
            `SELECT * FROM seminar.seminars WHERE id = $1`,
            [seminarId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Seminar not found' },
                { status: 404 }
            );
        }

        const seminar = result.rows[0];

        if (!seminar.certificate_enabled) {
            return NextResponse.json(
                { error: 'Certificates are not enabled for this seminar' },
                { status: 400 }
            );
        }

        if (!seminar.contact_email) {
            return NextResponse.json(
                { error: 'No coordinator email found for this seminar' },
                { status: 400 }
            );
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zecurx.com';
        const certificatePageUrl = `${baseUrl}/seminars/${seminarId}/certificate`;

        const coordinatorSent = await sendCoordinatorCertificateAlert({
            coordinatorName: seminar.contact_person || 'Coordinator',
            coordinatorEmail: seminar.contact_email,
            seminarTitle: seminar.title,
            seminarId: seminarId,
            certificatePageUrl,
        });

        if (!coordinatorSent) {
            return NextResponse.json(
                { error: 'Failed to send email to coordinator' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Certificate alert sent to coordinator: ${seminar.contact_person} (${seminar.contact_email}).`,
        });

    } catch (error) {
        console.error('Failed to notify coordinator:', error);
        return NextResponse.json(
            { error: 'Failed to send coordinator alert' },
            { status: 500 }
        );
    }
}
