import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { Seminar, SeminarRegistration } from '@/types/seminar';
import { sendCoordinatorCertificateAlert, sendStudentCertificateAlert } from '@/lib/certificate';

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

        // Send coordinator alert
        const coordinatorSent = await sendCoordinatorCertificateAlert({
            coordinatorName: seminar.contact_person || 'Coordinator',
            coordinatorEmail: seminar.contact_email,
            seminarTitle: seminar.title,
            seminarId: seminarId,
            certificatePageUrl,
        });

        // Fetch all verified registrations
        const registrationsResult = await query<SeminarRegistration>(
            `SELECT * FROM seminar.registrations 
             WHERE seminar_id = $1 AND email_verified = true`,
            [seminarId]
        );

        const registrations = registrationsResult.rows;
        let studentsSent = 0;
        let studentsFailed = 0;

        // Send certificate release emails to all registered students
        if (registrations.length > 0) {
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
            studentsSent = results.filter(Boolean).length;
            studentsFailed = results.filter(r => !r).length;
        }

        if (!coordinatorSent && studentsSent === 0) {
            return NextResponse.json(
                { error: 'Failed to send emails to coordinator and students' },
                { status: 500 }
            );
        }

        const messages: string[] = [];
        if (coordinatorSent) {
            messages.push(`Coordinator: ${seminar.contact_person} (${seminar.contact_email})`);
        } else {
            messages.push(`Failed to notify coordinator`);
        }
        if (studentsSent > 0) {
            messages.push(`Students notified: ${studentsSent}/${registrations.length}`);
        }
        if (studentsFailed > 0) {
            messages.push(`Failed to notify ${studentsFailed} student(s)`);
        }
        if (registrations.length === 0) {
            messages.push(`No verified student registrations found`);
        }

        return NextResponse.json({
            success: true,
            message: `Certificate alert sent. ${messages.join('. ')}.`,
            details: {
                coordinatorSent,
                studentsSent,
                studentsFailed,
                totalRegistrations: registrations.length,
            },
        });

    } catch (error) {
        console.error('Failed to notify coordinator and students:', error);
        return NextResponse.json(
            { error: 'Failed to send certificate alerts' },
            { status: 500 }
        );
    }
}
