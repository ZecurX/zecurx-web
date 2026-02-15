import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createCertificate, sendCertificateEmail } from '@/lib/certificate';
import { checkSeminarRateLimit, getClientIp } from '@/lib/rate-limit';
import { Seminar, SeminarRegistration, SeminarFeedback } from '@/types/seminar';

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

        const {
            fullName,
            email,
            collegeName,
            year,
            cityState,
            reminderContact,
            careerInterest,
            offensiveSecurityReason,
            seminarRating,
            mostValuablePart,
            futureSuggestions,
            joinZecurx,
            certificateName,
            registrationId,
            nameChangeReason,
        } = body;

        if (!fullName || !email || !certificateName) {
            return NextResponse.json(
                { error: 'Required fields missing' },
                { status: 400 }
            );
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

        if (!seminar.certificate_enabled) {
            return NextResponse.json(
                { error: 'Certificates are not available for this seminar yet' },
                { status: 400 }
            );
        }

        const existingFeedback = await query<SeminarFeedback>(
            `SELECT * FROM seminar.feedback WHERE seminar_id = $1 AND email = $2`,
            [seminarId, email.toLowerCase()]
        );

        if (existingFeedback.rows.length > 0) {
            return NextResponse.json(
                { error: 'You have already submitted feedback for this seminar' },
                { status: 400 }
            );
        }

        let regId = registrationId;

        if (!regId) {
            const regResult = await query<SeminarRegistration>(
                `SELECT * FROM seminar.registrations 
                 WHERE seminar_id = $1 AND email = $2 AND email_verified = true`,
                [seminarId, email.toLowerCase()]
            );

            if (regResult.rows.length > 0) {
                regId = regResult.rows[0].id;
            }
        }

        const feedbackResult = await query<SeminarFeedback>(
            `INSERT INTO seminar.feedback (
                registration_id, seminar_id,
                full_name, email, college_name, year, city_state, reminder_contact,
                career_interest, offensive_security_reason,
                seminar_rating, most_valuable_part, future_suggestions, join_zecurx,
                certificate_name
            ) VALUES (
                $1, $2,
                $3, $4, $5, $6, $7, $8,
                $9, $10,
                $11, $12, $13, $14,
                $15
            ) RETURNING *`,
            [
                regId || null,
                seminarId,
                fullName,
                email.toLowerCase(),
                collegeName || null,
                year || null,
                cityState || null,
                reminderContact || null,
                careerInterest || null,
                offensiveSecurityReason || null,
                seminarRating || null,
                mostValuablePart || null,
                futureSuggestions || null,
                joinZecurx || false,
                certificateName,
            ]
        );

        const feedback = feedbackResult.rows[0];

        let registeredName: string | null = null;
        if (regId) {
            const regLookup = await query<SeminarRegistration>(
                `SELECT full_name FROM seminar.registrations WHERE id = $1`,
                [regId]
            );
            if (regLookup.rows.length > 0) {
                registeredName = regLookup.rows[0].full_name;
            }
        }
        if (!registeredName) {
            registeredName = String(fullName);
        }

        const nameMatches = certificateName.trim().toLowerCase() === registeredName.trim().toLowerCase();

        if (!nameMatches) {
            if (!nameChangeReason || nameChangeReason.trim().length < 10) {
                return NextResponse.json(
                    { error: 'Please provide a reason for the name change (minimum 10 characters)' },
                    { status: 400 }
                );
            }

            await query(
                `INSERT INTO seminar.certificate_name_requests (
                    feedback_id, seminar_id, registration_id, email,
                    registered_name, requested_name, reason
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    feedback.id,
                    seminarId,
                    regId || null,
                    email.toLowerCase(),
                    registeredName,
                    certificateName,
                    nameChangeReason.trim(),
                ]
            );

            return NextResponse.json({
                success: true,
                nameChangeRequested: true,
                message: 'Your name change request has been submitted for admin approval. You will receive the certificate via email once approved.',
            });
        }

        const certificate = await createCertificate({
            recipientName: certificateName,
            recipientEmail: email.toLowerCase(),
            seminarTitle: seminar.title,
            seminarDate: new Date(seminar.date),
            speakerName: seminar.speaker_name,
            organization: collegeName || seminar.organization_name,
            seminarId: seminarId,
            registrationId: regId || null,
            feedbackId: feedback.id,
        });

        const emailSent = await sendCertificateEmail(certificate, email.toLowerCase());

        return NextResponse.json({
            success: true,
            message: emailSent 
                ? 'Feedback submitted and certificate sent to your email' 
                : 'Feedback submitted. Certificate generated but email delivery failed.',
            emailSent,
            certificate: {
                id: certificate.id,
                certificateId: certificate.certificate_id,
                recipientName: certificate.recipient_name,
            },
        });

    } catch (error) {
        console.error('Feedback submission error:', error);
        return NextResponse.json(
            { error: 'Failed to submit feedback' },
            { status: 500 }
        );
    }
}
