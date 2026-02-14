import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { CertificateNameRequest, SeminarFeedback, Seminar } from '@/types/seminar';
import { createCertificate, sendCertificateEmail } from '@/lib/certificate';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; requestId: string }> }
) {
    const authResult = await requirePermission('seminars', 'update', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id: seminarId, requestId } = await params;

        const reqResult = await query<CertificateNameRequest>(
            `SELECT * FROM seminar.certificate_name_requests 
             WHERE id = $1 AND seminar_id = $2`,
            [requestId, seminarId]
        );

        if (reqResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'Name request not found' },
                { status: 404 }
            );
        }

        const nameRequest = reqResult.rows[0];

        if (nameRequest.status !== 'pending') {
            return NextResponse.json(
                { error: `Request has already been ${nameRequest.status}` },
                { status: 400 }
            );
        }

        await query(
            `UPDATE seminar.certificate_name_requests 
             SET status = 'approved', reviewed_at = NOW(), reviewed_by = $1
             WHERE id = $2`,
            [authResult.session.sub, requestId]
        );

        const feedbackResult = await query<SeminarFeedback>(
            `SELECT * FROM seminar.feedback WHERE id = $1`,
            [nameRequest.feedback_id]
        );

        const seminarResult = await query<Seminar>(
            `SELECT * FROM seminar.seminars WHERE id = $1`,
            [seminarId]
        );

        if (feedbackResult.rows.length === 0 || seminarResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'Associated feedback or seminar not found' },
                { status: 404 }
            );
        }

        const feedback = feedbackResult.rows[0];
        const seminar = seminarResult.rows[0];

        const certificate = await createCertificate({
            recipientName: nameRequest.requested_name,
            recipientEmail: nameRequest.email,
            seminarTitle: seminar.title,
            seminarDate: new Date(seminar.date),
            speakerName: seminar.speaker_name,
            organization: feedback.college_name || seminar.organization_name,
            seminarId: seminarId,
            registrationId: nameRequest.registration_id,
            feedbackId: nameRequest.feedback_id,
        });

        const emailSent = await sendCertificateEmail(certificate, nameRequest.email);

        return NextResponse.json({
            success: true,
            message: emailSent
                ? 'Name request approved and certificate sent'
                : 'Name request approved but email delivery failed',
            emailSent,
        });

    } catch (error) {
        console.error('Failed to approve name request:', error);
        return NextResponse.json(
            { error: 'Failed to approve name request' },
            { status: 500 }
        );
    }
}
