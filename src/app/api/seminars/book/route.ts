import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { query } from '@/lib/db';
import { checkSeminarRateLimit, getClientIp } from '@/lib/rate-limit';
import { Seminar } from '@/types/seminar';

export async function POST(request: NextRequest) {
    const clientIp = getClientIp(request);
    const limit = await checkSeminarRateLimit(clientIp);

    if (!limit.success) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
        );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const body = await request.json();
        const {
            name,
            email,
            phone,
            organization,
            title,
            description,
            seminarType,
            topic,
            speakerName,
            speakerTitle,
            duration,
            locationType,
            venueAddress,
            attendees,
            preferredDate,
            message,
        } = body;

        if (!name || !email || !organization || !title || !description || !speakerName || !duration || !preferredDate) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const date = new Date(preferredDate);
        const timeStr = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZoneName: 'short'
        });

        const result = await query<Seminar>(
            `INSERT INTO seminar.seminars (
                title, description, date, time, duration,
                speaker_name, speaker_title, seminar_type, topic,
                location_type, venue_address, max_attendees,
                organization_name, contact_person, contact_email, contact_phone,
                additional_notes, status
            ) VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9,
                $10, $11, $12,
                $13, $14, $15, $16,
                $17, 'pending'
            ) RETURNING *`,
            [
                title,
                description,
                date.toISOString(),
                timeStr,
                duration,
                speakerName,
                speakerTitle || null,
                seminarType,
                topic,
                locationType,
                venueAddress || null,
                attendees,
                organization,
                name,
                email,
                phone || null,
                message || null,
            ]
        );

        const seminar = result.rows[0];

        const adminEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 10px;">
                    New Seminar Booking Request
                </h2>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #333;">Seminar Details</h3>
                    <p><strong>Title:</strong> ${title}</p>
                    <p><strong>Type:</strong> ${seminarType}</p>
                    <p><strong>Topic:</strong> ${topic}</p>
                    <p><strong>Duration:</strong> ${duration}</p>
                    <p><strong>Date:</strong> ${date.toLocaleDateString('en-US', { dateStyle: 'full' })} at ${timeStr}</p>
                    <p><strong>Location:</strong> ${locationType === 'online' ? 'Online' : venueAddress}</p>
                    <p><strong>Expected Attendees:</strong> ${attendees}</p>
                </div>

                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #333;">Speaker</h3>
                    <p><strong>Name:</strong> ${speakerName}</p>
                    ${speakerTitle ? `<p><strong>Title:</strong> ${speakerTitle}</p>` : ''}
                </div>

                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #333;">Contact Person</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                    <p><strong>Organization:</strong> ${organization}</p>
                </div>

                ${message ? `
                <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h3 style="margin-top: 0; color: #333;">Additional Notes</h3>
                    <p style="color: #555;">${message.replace(/\n/g, '<br>')}</p>
                </div>` : ''}

                <div style="margin-top: 30px; padding: 20px; background: #1a1a1a; border-radius: 8px; text-align: center;">
                    <p style="color: #fff; margin: 0 0 15px 0;"><strong>Action Required</strong></p>
                    <p style="color: #ccc; font-size: 14px; margin: 0;">
                        Review this booking request in the admin panel and approve or reject it.
                    </p>
                </div>

                <p style="color: #888; font-size: 12px; margin-top: 20px;">
                    Seminar ID: ${seminar.id}
                </p>
            </div>
        `;

        const userEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                <h2 style="color: #1a1a1a;">Thank you, ${name}!</h2>
                <p style="color: #555;">
                    Your seminar booking request has been submitted successfully and is currently under review.
                </p>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #333;">Booking Summary</h3>
                    <p><strong>Seminar:</strong> ${title}</p>
                    <p><strong>Date:</strong> ${date.toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
                    <p><strong>Duration:</strong> ${duration}</p>
                    <p><strong>Location:</strong> ${locationType === 'online' ? 'Online' : venueAddress}</p>
                    <p><strong>Expected Attendees:</strong> ${attendees}</p>
                </div>

                <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #2e7d32;">What happens next?</h3>
                    <ol style="color: #555; padding-left: 20px;">
                        <li>Our team will review your request within 24-48 hours</li>
                        <li>Once approved, you'll receive a confirmation email</li>
                        <li>You'll get a unique registration link to share with your students</li>
                        <li>Students can register and receive their certificates after the seminar</li>
                    </ol>
                </div>

                <p style="color: #888; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                    Best regards,<br>The ZecurX Team
                </p>
            </div>
        `;

        try {
            await resend.emails.send({
                from: 'ZecurX Website <official@zecurx.com>',
                to: 'official@zecurx.com',
                replyTo: email,
                subject: `New Seminar Booking: ${title} - ${organization}`,
                html: adminEmailHtml,
            });

            await resend.emails.send({
                from: 'ZecurX <official@zecurx.com>',
                to: email,
                subject: `Seminar Booking Request Received - ZecurX`,
                html: userEmailHtml,
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }

        return NextResponse.json({
            success: true,
            message: 'Booking request submitted successfully',
            seminarId: seminar.id,
        });

    } catch (error) {
        console.error('Seminar booking error:', error);
        return NextResponse.json(
            { error: 'Failed to process booking request' },
            { status: 500 }
        );
    }
}
