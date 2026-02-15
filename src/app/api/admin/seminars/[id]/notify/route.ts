import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { Seminar, SeminarRegistration } from '@/types/seminar';

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

        const resend = new Resend(process.env.RESEND_API_KEY);

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

        // Send emails to all participants
        const emailPromises = registrations.map(async (reg) => {
            const notificationEmailHtml = `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
                    <div style="background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); padding: 40px 30px; text-align: center;">
                        <img src="https://www.zecurx.com/images/zecurx-logo.png" alt="ZecurX" style="height: 40px; display: block; margin: 0 auto;" />
                        <p style="color: #a0a0a0; margin: 15px 0 0 0; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">Cybersecurity Solutions</p>
                    </div>
                    
                    <div style="padding: 40px 30px;">
                        <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 22px;">
                            📢 ${subject}
                        </h2>
                        
                        <p style="color: #555; line-height: 1.7; margin-bottom: 25px;">
                            Hi <strong>${reg.full_name}</strong>,
                        </p>

                        <div style="color: #555; line-height: 1.8; margin-bottom: 25px; white-space: pre-wrap;">
${message}
                        </div>

                        <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
                            <h3 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 16px; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">
                                Seminar Details
                            </h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Seminar:</td>
                                    <td style="padding: 8px 0; color: #1a1a1a; text-align: right; font-weight: 500;">${seminar.title}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Date:</td>
                                    <td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${dateStr}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Time:</td>
                                    <td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${seminar.time}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Location:</td>
                                    <td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${seminar.location_type === 'online' ? 'Online' : seminar.venue_address || 'On-site'}</td>
                                </tr>
                            </table>
                        </div>

                        <p style="color: #888; line-height: 1.7; font-size: 14px;">
                            If you have any questions, feel free to reply to this email or contact us at 
                            <a href="mailto:official@zecurx.com" style="color: #2196f3;">official@zecurx.com</a>
                        </p>
                    </div>

                    <div style="background: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                        <p style="color: #888; font-size: 12px; margin: 0;">
                            © ${new Date().getFullYear()} ZecurX Private Limited. All rights reserved.<br>
                            <a href="https://www.zecurx.com" style="color: #2196f3; text-decoration: none;">www.zecurx.com</a>
                        </p>
                    </div>
                </div>
            `;

            try {
                await resend.emails.send({
                    from: 'ZecurX Private Limited <official@zecurx.com>',
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
