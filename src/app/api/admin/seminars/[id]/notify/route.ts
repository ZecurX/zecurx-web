import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendgrid';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { Seminar, SeminarRegistration } from '@/types/seminar';
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
        const body = await request.json();
        const { subject, message } = body;

        if (!subject || !message) {
            return NextResponse.json(
                { error: 'Subject and message are required' },
                { status: 400 }
            );
        }



        // Get seminar details
        const seminarResult = await query<Seminar>(
            `SELECT * FROM seminar.seminars WHERE id = $1`,
            [id]
        );

        if (seminarResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'Seminar not found' },
                { status: 404 }
            );
        }

        const seminar = seminarResult.rows[0];

        // Get all verified registrations
        const registrationsResult = await query<SeminarRegistration>(
            `SELECT * FROM seminar.registrations 
             WHERE seminar_id = $1 AND email_verified = true`,
            [id]
        );

        const registrations = registrationsResult.rows;

        if (registrations.length === 0) {
            return NextResponse.json(
                { error: 'No verified participants to notify' },
                { status: 400 }
            );
        }

        const date = new Date(seminar.date);
        const dateStr = date.toLocaleDateString('en-US', { dateStyle: 'full' });

        const emailPromises = registrations.map(async (reg) => {
            const bodyContent = `
                <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 22px;">📢 ${subject}</h2>
                
                <p style="color: #555; line-height: 1.7; margin: 0 0 20px 0;">
                    Hi <strong>${reg.full_name}</strong>,
                </p>

                <div style="color: #555; line-height: 1.8; margin: 0 0 20px 0; white-space: pre-wrap;">
${message}
                </div>

                ${emailSection(
                    'Seminar Details',
                    `
                    <table width="100%" style="border-collapse: collapse;">
                        <tr><td style="padding: 8px 0; color: #666;"><strong>Seminar:</strong></td><td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${seminar.title}</td></tr>
                        <tr><td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td><td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${dateStr}</td></tr>
                        <tr><td style="padding: 8px 0; color: #666;"><strong>Time:</strong></td><td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${seminar.time}</td></tr>
                        <tr><td style="padding: 8px 0; color: #666;"><strong>Location:</strong></td><td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${seminar.location_type === 'online' ? 'Online' : seminar.venue_address || 'On-site'}</td></tr>
                    </table>
                    `
                )}

                <p style="color: #888; line-height: 1.7; font-size: 14px; margin: 0;">
                    If you have any questions, feel free to reply to this email or contact us at 
                    <a href="mailto:official@zecurx.com" style="color: #0a0a0f; text-decoration: underline;">official@zecurx.com</a>
                </p>
            `;

            const notificationEmailHtml = brandedEmailTemplate({
                accent: 'info',
                body: bodyContent,
                previewText: `${subject} - ${seminar.title}`,
                includeMarketing: false,
                showSocials: false,
            });

            try {
                await sendEmail({
                    to: reg.email,
                    subject: `${subject} - ${seminar.title}`,
                    html: notificationEmailHtml,
                });
                return { email: reg.email, success: true };
            } catch (error) {
                console.error(`Failed to send email to ${reg.email}:`, error);
                return { email: reg.email, success: false, error };
            }
        });

        const results = await Promise.all(emailPromises);
        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        return NextResponse.json({
            success: true,
            message: `Notifications sent to ${successCount} participant(s)${failCount > 0 ? `, ${failCount} failed` : ''}`,
            totalParticipants: registrations.length,
            successCount,
            failCount,
        });

    } catch (error) {
        console.error('Failed to send notifications:', error);
        return NextResponse.json(
            { error: 'Failed to send notifications' },
            { status: 500 }
        );
    }
}
