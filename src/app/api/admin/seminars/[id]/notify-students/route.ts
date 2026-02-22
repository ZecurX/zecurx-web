import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { Seminar, SeminarRegistration } from '@/types/seminar';
import { sendStudentCertificateAlert } from '@/lib/certificate';

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

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zecurx.com';
        const certificatePageUrl = `${baseUrl}/seminars/${seminarId}/certificate`;

        // Fetch all verified registrations
        const registrationsResult = await query<SeminarRegistration>(
            `SELECT * FROM seminar.registrations 
             WHERE seminar_id = $1 AND email_verified = true`,
            [seminarId]
        );

        const registrations = registrationsResult.rows;

        if (registrations.length === 0) {
            return NextResponse.json(
                { error: 'No verified student registrations found' },
                { status: 400 }
            );
        }

        const emailPromises = registrations.map(async (reg) => {
            const sent = await sendStudentCertificateAlert({
                studentName: reg.full_name,
                studentEmail: reg.email,
                seminarTitle: seminar.title,
                seminarId: seminarId,
                certificatePageUrl,
            });
            return sent;
        });

        const results = await Promise.all(emailPromises);
        const studentsSent = results.filter(Boolean).length;
        const studentsFailed = results.filter(r => !r).length;

        if (studentsSent === 0) {
            return NextResponse.json(
                { error: 'Failed to send emails to students' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Certificate alert sent to ${studentsSent}/${registrations.length} participant(s).${studentsFailed > 0 ? ` ${studentsFailed} failed.` : ''}`,
            details: {
                studentsSent,
                studentsFailed,
                totalRegistrations: registrations.length,
            },
        });

    } catch (error) {
        console.error('Failed to notify students:', error);
        return NextResponse.json(
            { error: 'Failed to send student alerts' },
            { status: 500 }
        );
    }
}
