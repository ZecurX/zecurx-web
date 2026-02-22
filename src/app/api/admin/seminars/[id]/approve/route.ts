import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendgrid';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { Seminar } from '@/types/seminar';
import { brandedEmailTemplate, emailSection } from '@/lib/email-template';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requirePermission('seminars', 'update', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id } = await params;


        const result = await query<Seminar>(
            `UPDATE seminar.seminars 
             SET status = 'approved', approved_at = NOW(), updated_at = NOW()
             WHERE id = $1 AND status = 'pending'
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Seminar not found or already processed' },
                { status: 404 }
            );
        }

        const seminar = result.rows[0];

        const registrationLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://zecurx.com'}/seminars/${seminar.id}/register`;

        const date = new Date(seminar.date);
        const dateStr = date.toLocaleDateString('en-US', { dateStyle: 'full' });

        const bodyContent = `
            <p style="color: #333; font-size: 16px; margin: 0 0 20px 0; text-align: center;">
                <strong style="color: #2e7d32;">✓ Seminar Approved!</strong> Your seminar booking has been approved.
            </p>

            ${emailSection(seminar.title, `
                <table width="100%" style="border-collapse: collapse;">
                    <tr><td style="padding: 8px 0; color: #555; font-size: 14px;"><strong>Date:</strong> ${dateStr}</td></tr>
                    <tr><td style="padding: 8px 0; color: #555; font-size: 14px;"><strong>Time:</strong> ${seminar.time}</td></tr>
                    <tr><td style="padding: 8px 0; color: #555; font-size: 14px;"><strong>Duration:</strong> ${seminar.duration}</td></tr>
                    <tr><td style="padding: 8px 0; color: #555; font-size: 14px;"><strong>Speaker:</strong> ${seminar.speaker_name}</td></tr>
                    <tr><td style="padding: 8px 0; color: #555; font-size: 14px;"><strong>Location:</strong> ${seminar.location_type === 'online' ? 'Online' : seminar.venue_address}</td></tr>
                </table>
            `)}

            <p style="color: #666; font-size: 14px; margin: 20px 0;">
                Share the registration link below with your students:
            </p>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0 0; text-align: center; word-break: break-all;">
                <a href="${registrationLink}" style="color: #0a0a0f; text-decoration: underline;">${registrationLink}</a>
            </p>

            <p style="color: #666; font-size: 14px; margin: 20px 0;">
                <strong>What happens next:</strong>
            </p>
            <ol style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.8;">
                <li>Share the registration link with your students</li>
                <li>Students register using their email (OTP verification)</li>
                <li>After the seminar, mark attendance in the admin panel</li>
                <li>Enable certificates for students to download</li>
            </ol>
        `;

        const approvalEmailHtml = brandedEmailTemplate({
            accent: 'success',
            body: bodyContent,
            previewText: `Seminar Approved: ${seminar.title}`,
            cta: {
                title: 'Seminar Details',
                description: 'View and share the registration link',
                buttonText: 'REGISTRATION LINK',
                buttonUrl: registrationLink
            },
            includeMarketing: true,
            marketingType: 'corporate',
            showSocials: true,
        });

        try {
            await sendEmail({
                to: seminar.contact_email,
                subject: `Seminar Approved: ${seminar.title} - ZecurX`,
                html: approvalEmailHtml,
            });
        } catch (emailError) {
            console.error('Failed to send approval email:', emailError);
        }

        return NextResponse.json({
            success: true,
            message: 'Seminar approved successfully',
            seminar,
            registrationLink,
        });

    } catch (error) {
        console.error('Failed to approve seminar:', error);
        return NextResponse.json(
            { error: 'Failed to approve seminar' },
            { status: 500 }
        );
    }
}
