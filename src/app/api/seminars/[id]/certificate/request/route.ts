import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createOtp, sendOtpEmail } from '@/lib/otp';
import { checkSeminarRateLimit, getClientIp } from '@/lib/rate-limit';
import { Seminar, SeminarRegistration } from '@/types/seminar';

export const config = {
    maxDuration: 60,
};

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
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
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

        // CHECK REGISTRATION BEFORE SENDING OTP
        const regResult = await query<SeminarRegistration>(
            `SELECT * FROM seminar.registrations 
             WHERE seminar_id = $1 AND email = $2`,
            [seminarId, email.trim().toLowerCase()]
        );

        if (regResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'You must be registered for this seminar to receive a certificate.' },
                { status: 404 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        const otp = await createOtp(normalizedEmail, 'certificate', seminarId);

        const { sent, error: emailError } = await sendOtpEmail(
            email.trim(),
            otp,
            'certificate',
            seminar.title
        );

        if (!sent) {
            console.error(`Certificate OTP email failed for ${email} at seminar ${seminarId}:`, emailError);
            return NextResponse.json(
                { error: 'Failed to send verification email. Please try again later.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'OTP sent to your email',
        });

    } catch (error) {
        console.error('Certificate request error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
