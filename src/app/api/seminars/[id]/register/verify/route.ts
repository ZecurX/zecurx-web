import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendgrid';
import { query } from '@/lib/db';
import { verifyOtp } from '@/lib/otp';
import { checkSeminarRateLimit, getClientIp } from '@/lib/rate-limit';
import { Seminar, SeminarRegistration } from '@/types/seminar';
import { brandedEmailTemplate, emailSection, emailCourseCatalog } from '@/lib/email-template';
import { courses } from '@/lib/courses';

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

        const bodyContent = `
            <h2 style="color: #2e7d32; margin: 0 0 16px 0; font-size: 22px; text-align: center;">
                ✓ Registration Confirmed!
            </h2>
            <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0; text-align: center;">
                You're all set for the seminar.
            </p>

            ${emailSection(seminar.title, `
                <table width="100%" style="border-collapse: collapse;">
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Date:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${dateStr}</td></tr>
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Time:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${seminar.time}</td></tr>
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Duration:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${seminar.duration}</td></tr>
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Speaker:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${seminar.speaker_name}${seminar.speaker_title ? `, ${seminar.speaker_title}` : ''}</td></tr>
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Location:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${seminar.location_type === 'online' ? 'Online' : seminar.venue_address}</td></tr>
                </table>
            `)}

            <p style="color: #666; font-size: 14px; margin: 20px 0;">
                <strong>Important reminders:</strong>
            </p>
            <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.8;">
                <li>Please arrive 10 minutes before the scheduled time</li>
                <li>Bring your student/employee ID for verification</li>
                <li>Certificates will be available after the seminar</li>
            </ul>

            <p style="color: #999; font-size: 12px; margin: 20px 0 0 0; text-align: center;">
                Registration ID: ${registration.id}
            </p>

            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
                <tr>
                    <td style="text-align: center; padding: 20px 0;">
                        <a href="${getGoogleCalendarUrl()}" style="display: inline-block; background-color: #0a0a0f; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">Add to Google Calendar</a>
                    </td>
                </tr>
            </table>


            ${emailCourseCatalog(courses.slice(0, 4).map(course => ({
                title: course.title,
                description: course.description,
                level: course.level,
                logo: course.logo
            })))}
        `;

        const confirmationHtml = brandedEmailTemplate({
            accent: 'success',
            body: bodyContent,
            previewText: `Registration Confirmed: ${seminar.title}`,
            includeMarketing: false,
            showSocials: false,
        });

        try {
            await sendEmail({
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
