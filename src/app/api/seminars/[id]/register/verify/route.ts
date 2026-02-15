import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { query } from '@/lib/db';
import { verifyOtp } from '@/lib/otp';
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
        const { email: rawEmail, otp } = body;
        const email = rawEmail?.trim().toLowerCase();

        if (!email || !otp) {
            return NextResponse.json(
                { error: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        const verification = await verifyOtp(
            email,
            otp,
            'registration',
            seminarId
        );

        if (!verification.valid) {
            return NextResponse.json(
                { error: verification.error },
                { status: 400 }
            );
        }

        const regResult = await query<SeminarRegistration>(
            `UPDATE seminar.registrations 
              SET email_verified = true, verified_at = NOW()
              WHERE seminar_id = $1 AND email = $2
              RETURNING *`,
            [seminarId, email]
        );

        if (regResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'Registration not found' },
                { status: 404 }
            );
        }

        const registration = regResult.rows[0];

        const seminarResult = await query<Seminar>(
            `SELECT * FROM seminar.seminars WHERE id = $1`,
            [seminarId]
        );
        const seminar = seminarResult.rows[0];

        const resend = new Resend(process.env.RESEND_API_KEY);

        const date = new Date(seminar.date);
        const dateStr = date.toLocaleDateString('en-US', { dateStyle: 'full' });

        const getGoogleCalendarUrl = () => {
            const start = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
            const endDate = new Date(date.getTime() + 2 * 60 * 60 * 1000);
            const end = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
            const title = encodeURIComponent(seminar.title);
            const details = encodeURIComponent(`ZecurX Seminar: ${seminar.title}\nSpeaker: ${seminar.speaker_name}`);
            const location = encodeURIComponent(seminar.venue_address || 'Online');
            return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
        };

        const confirmationHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1a1a1a; margin: 0;">ZecurX</h1>
                    <p style="color: #666; margin: 5px 0 0 0;">Cybersecurity Excellence</p>
                </div>

                <div style="background: #e8f5e9; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #2e7d32; margin: 0 0 10px 0;">Registration Confirmed!</h2>
                    <p style="color: #555; margin: 0;">You're all set for the seminar.</p>
                </div>

                <div style="background: #f5f5f5; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
                    <h3 style="margin: 0 0 15px 0; color: #1a1a1a;">${seminar.title}</h3>
                    <p style="margin: 5px 0; color: #555;"><strong>Date:</strong> ${dateStr}</p>
                    <p style="margin: 5px 0; color: #555;"><strong>Time:</strong> ${seminar.time}</p>
                    <p style="margin: 5px 0; color: #555;"><strong>Duration:</strong> ${seminar.duration}</p>
                    <p style="margin: 5px 0; color: #555;"><strong>Speaker:</strong> ${seminar.speaker_name}${seminar.speaker_title ? `, ${seminar.speaker_title}` : ''}</p>
                    <p style="margin: 5px 0; color: #555;"><strong>Location:</strong> ${seminar.location_type === 'online' ? 'Online' : seminar.venue_address}</p>
                </div>

                <div style="text-align: center; margin-bottom: 30px;">
                    <a href="${getGoogleCalendarUrl()}" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Add to Google Calendar
                    </a>
                </div>

                <div style="background: #fff3e0; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
                    <h4 style="margin: 0 0 10px 0; color: #e65100;">Important Notes</h4>
                    <ul style="margin: 0; padding-left: 20px; color: #555;">
                        <li>Please arrive 10 minutes before the scheduled time</li>
                        <li>Bring your student/employee ID for verification</li>
                        <li>Certificates will be available after the seminar</li>
                    </ul>
                </div>

                <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                    If you have any questions, contact us at official@zecurx.com<br>
                    Registration ID: ${registration.id}
                </p>
            </div>
        `;

        try {
            await resend.emails.send({
                from: 'ZecurX Private Limited <official@zecurx.com>',
                to: email,
                subject: `Registration Confirmed: ${seminar.title} - ZecurX`,
                html: confirmationHtml,
            });
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
        }

        return NextResponse.json({
            success: true,
            message: 'Registration verified successfully',
            registration: {
                id: registration.id,
                fullName: registration.full_name,
                email: registration.email,
            },
        });

    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { error: 'Failed to verify registration' },
            { status: 500 }
        );
    }
}
