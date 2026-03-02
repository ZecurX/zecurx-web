import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendgrid';
import { query } from '@/lib/db';
import { checkSeminarRateLimit, getClientIp } from '@/lib/rate-limit';
import { Seminar } from '@/types/seminar';
import { brandedEmailTemplate, emailSection } from '@/lib/email-template';

export async function POST(request: NextRequest) {
    const clientIp = getClientIp(request);
    const limit = await checkSeminarRateLimit(clientIp);

    if (!limit.success) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
        );
    }



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
            duration,
            locationType,
            venueAddress,
            attendees,
            preferredDate,
            message,
        } = body;

        if (!name || !email || !organization || !title || !description || !duration || !preferredDate) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Default speaker info if not provided (removed from form)
        const speakerName = body.speakerName || 'ZecurX Team';
        const speakerTitle = body.speakerTitle || 'Cybersecurity Experts';

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

        const adminBodyContent = `
            <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
                <strong>New Seminar Booking Request Received</strong>
            </p>

            ${emailSection('Seminar Details', `
                <table width="100%" style="border-collapse: collapse;">
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Title:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${title}</td></tr>
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Type:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${seminarType}</td></tr>
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Topic:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${topic}</td></tr>
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Duration:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${duration}</td></tr>
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Date:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${date.toLocaleDateString('en-US', { dateStyle: 'full' })} at ${timeStr}</td></tr>
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Location:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${locationType === 'online' ? 'Online' : venueAddress}</td></tr>
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Expected Attendees:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${attendees}</td></tr>
                </table>
            `)}

            ${emailSection('Speaker', `
                <table width="100%" style="border-collapse: collapse;">
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Name:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${speakerName}</td></tr>
                    ${speakerTitle ? `<tr><td style="padding: 6px 0; color: #666;"><strong>Title:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${speakerTitle}</td></tr>` : ''}
                </table>
            `)}

            ${emailSection('Contact Person', `
                <table width="100%" style="border-collapse: collapse;">
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Name:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${name}</td></tr>
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Email:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${email}</td></tr>
                    ${phone ? `<tr><td style="padding: 6px 0; color: #666;"><strong>Phone:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${phone}</td></tr>` : ''}
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Organization:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${organization}</td></tr>
                </table>
            `)}

            ${message ? emailSection('Additional Notes', `<p style="color: #555; margin: 0; white-space: pre-wrap;">${message}</p>`) : ''}

            <p style="color: #999; font-size: 12px; margin: 20px 0 0 0; text-align: center;">
                Seminar ID: ${seminar.id}
            </p>
        `;

        const adminEmailHtml = brandedEmailTemplate({
            accent: 'info',
            body: adminBodyContent,
            previewText: `New Seminar Booking: ${title}`,
            cta: {
                title: 'Review Booking',
                description: 'Review and approve or reject this booking request in the admin panel',
                buttonText: 'GO TO ADMIN PANEL',
                buttonUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://zecurx.com'}/admin/seminars/${seminar.id}`
            },
            includeMarketing: false,
            showSocials: false,
        });

        const userBodyContent = `
            <h2 style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 22px;">
                Thank you, ${name}!
            </h2>
            <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                Your seminar booking request has been submitted successfully and is currently under review.
            </p>
            
            ${emailSection('Booking Summary', `
                <table width="100%" style="border-collapse: collapse;">
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Seminar:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${title}</td></tr>
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Date:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${date.toLocaleDateString('en-US', { dateStyle: 'full' })}</td></tr>
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Duration:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${duration}</td></tr>
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Location:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${locationType === 'online' ? 'Online' : venueAddress}</td></tr>
                    <tr><td style="padding: 6px 0; color: #666;"><strong>Expected Attendees:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${attendees}</td></tr>
                </table>
            `)}

            <p style="color: #666; font-size: 14px; margin: 20px 0;">
                <strong>What happens next:</strong>
            </p>
            <ol style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.8;">
                <li>Our team will review your request within 24-48 hours</li>
                <li>Once approved, you'll receive a confirmation email</li>
                <li>You'll get a unique registration link to share with your students</li>
                <li>Students can register and receive their certificates after the seminar</li>
            </ol>

            <p style="color: #888; font-size: 13px; margin: 20px 0; text-align: center;">
                Best regards,<br><strong>ZecurX Team</strong>
            </p>
        `;

        const userEmailHtml = brandedEmailTemplate({
            accent: 'default',
            body: userBodyContent,
            previewText: 'Seminar Booking Request Received',
            includeMarketing: true,
            marketingType: 'corporate',
            showSocials: true,
        });

        try {
            await sendEmail({
                to: 'official@zecurx.com',
                replyTo: email,
                subject: `New Seminar Booking: ${title} - ${organization}`,
                html: adminEmailHtml,
            });

            await sendEmail({
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
