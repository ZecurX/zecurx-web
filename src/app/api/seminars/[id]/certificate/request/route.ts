import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createOtp, sendOtpEmail } from '@/lib/otp';
import { checkSeminarRateLimit, getClientIp } from '@/lib/rate-limit';
import { Seminar } from '@/types/seminar';

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

        const otp = await createOtp(email.toLowerCase(), 'certificate', seminarId);

        const emailSent = await sendOtpEmail(
            email,
            otp,
            'certificate',
            seminar.title
        );

        if (!emailSent) {
            return NextResponse.json(
                { error: 'Failed to send verification email' },
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
