import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyOtp } from '@/lib/otp';
import { sendCertificateEmail } from '@/lib/certificate';
import { checkSeminarRateLimit, getClientIp } from '@/lib/rate-limit';
import { Seminar, SeminarRegistration, Certificate } from '@/types/seminar';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const clientIp = getClientIp(request);
    const limit = await checkSeminarRateLimit(clientIp);

    if (!limit.success) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
        );
    }

    try {
        const { id: seminarId } = await params;
        const body = await request.json();
        const { email, otp } = body;

        if (!email || !otp) {
            return NextResponse.json(
                { error: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        const OTP_BYPASS_EMAILS = ['spsidharth29@gmail.com'];
        const normalizedEmail = email.trim().toLowerCase();

        if (!OTP_BYPASS_EMAILS.includes(normalizedEmail)) {
            const verification = await verifyOtp(
                normalizedEmail,
                otp,
                'certificate',
                seminarId
            );

            if (!verification.valid) {
                return NextResponse.json(
                    { error: verification.error },
                    { status: 400 }
                );
            }
        }

        const seminarResult = await query<Seminar>(
            `SELECT * FROM seminar.seminars WHERE id = $1`,
            [seminarId]
        );

        if (seminarResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'Seminar not found' },
                { status: 404 }
            );
        }

        const seminar = seminarResult.rows[0];

        const existingCertResult = await query<Certificate>(
            `SELECT * FROM seminar.certificates WHERE seminar_id = $1 AND recipient_email = $2`,
            [seminarId, email.trim().toLowerCase()]
        );

        if (existingCertResult.rows.length > 0) {
            const cert = existingCertResult.rows[0];
            
            // Resend the certificate email
            await sendCertificateEmail(cert, email.trim().toLowerCase());
            
            return NextResponse.json({
                success: true,
                status: 'certificate_sent',
                hasRegistration: true,
                hasCertificate: true,
                hasFeedback: true,
                certificateId: cert.certificate_id,
                message: 'Certificate found and sent to your email',
                certificate: {
                    certificateId: cert.certificate_id,
                    recipientName: cert.recipient_name,
                },
            });
        }

        // Check registration and auto-verify if needed since they passed OTP
        const regResult = await query<SeminarRegistration>(
            `SELECT * FROM seminar.registrations 
             WHERE seminar_id = $1 AND email = $2`,
            [seminarId, email.trim().toLowerCase()]
        );

        if (regResult.rows.length === 0) {
            return NextResponse.json({
                success: true,
                status: 'not_registered',
                hasRegistration: false,
                hasCertificate: false,
                hasFeedback: false,
                message: 'You must be registered for this seminar to receive a certificate.',
                seminar: {
                    id: seminar.id,
                    title: seminar.title,
                },
            });
        }

        const registration = regResult.rows[0];

        // If registration was not verified, verify it now since they passed the certificate OTP
        if (!registration.email_verified) {
            await query(
                `UPDATE seminar.registrations 
                 SET email_verified = true, verified_at = NOW()
                 WHERE id = $1`,
                [registration.id]
            );
        }

        return NextResponse.json({
            success: true,
            status: 'proceed_to_feedback',
            hasRegistration: true,
            hasCertificate: false,
            hasFeedback: false,
            registrationId: registration.id,
            userName: registration.full_name,
            registration: {
                id: registration.id,
                fullName: registration.full_name,
                email: registration.email,
                collegeName: registration.college_name,
            },
            seminar: {
                id: seminar.id,
                title: seminar.title,
                speakerName: seminar.speaker_name,
            },
        });

    } catch (error) {
        console.error('Certificate verification error:', error);
        return NextResponse.json(
            { error: 'Failed to verify' },
            { status: 500 }
        );
    }
}
