import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createOtp, sendOtpEmail } from '@/lib/otp';
import { checkSeminarRateLimit, getClientIp } from '@/lib/rate-limit';
import { Seminar, SeminarRegistration } from '@/types/seminar';

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
        const { email, fullName, phone, collegeName, year, cityState } = body;

        if (!email || !fullName) {
            return NextResponse.json(
                { error: 'Email and full name are required' },
                { status: 400 }
            );
        }

        const seminarResult = await query<Seminar>(
            `SELECT * FROM seminar.seminars 
             WHERE id = $1 AND status = 'approved' AND registration_enabled = true`,
            [seminarId]
        );

        if (seminarResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'Seminar not found or registration is closed' },
                { status: 404 }
            );
        }

        const seminar = seminarResult.rows[0];

        // Date check removed to allow admin override via registration_enabled flag
        // if (new Date(seminar.date) < new Date()) { ... }

        const existingReg = await query<SeminarRegistration>(
            `SELECT * FROM seminar.registrations 
             WHERE seminar_id = $1 AND email = $2`,
            [seminarId, email.toLowerCase()]
        );

        if (existingReg.rows.length > 0) {
            const reg = existingReg.rows[0];
            if (reg.email_verified) {
                return NextResponse.json(
                    { error: 'You are already registered for this seminar' },
                    { status: 400 }
                );
            }

            await query(
                `UPDATE seminar.registrations 
                 SET full_name = $1, phone = $2, college_name = $3, year = $4, city_state = $5
                 WHERE id = $6`,
                [fullName, phone || null, collegeName || null, year || null, cityState || null, reg.id]
            );
        } else {
            await query(
                `INSERT INTO seminar.registrations 
                 (seminar_id, full_name, email, phone, college_name, year, city_state)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [seminarId, fullName, email.toLowerCase(), phone || null, collegeName || null, year || null, cityState || null]
            );
        }

        const otp = await createOtp(email.toLowerCase(), 'registration', seminarId);

        const emailSent = await sendOtpEmail(
            email,
            otp,
            'registration',
            seminar.title
        );

        if (!emailSent) {
            return NextResponse.json(
                { error: 'Failed to send verification email. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'OTP sent to your email',
        });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Failed to process registration' },
            { status: 500 }
        );
    }
}
