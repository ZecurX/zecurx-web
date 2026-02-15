import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { Seminar } from '@/types/seminar';

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
        const resend = new Resend(process.env.RESEND_API_KEY);

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

        const approvalEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1a1a1a; margin: 0;">ZecurX</h1>
                    <p style="color: #666; margin: 5px 0 0 0;">Cybersecurity Excellence</p>
                </div>

                <div style="background: #e8f5e9; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #2e7d32; margin: 0 0 10px 0;">Seminar Approved!</h2>
                    <p style="color: #555; margin: 0;">Your seminar booking has been approved.</p>
                </div>

                <div style="background: #f5f5f5; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
                    <h3 style="margin: 0 0 15px 0; color: #1a1a1a;">${seminar.title}</h3>
                    <p style="margin: 5px 0; color: #555;"><strong>Date:</strong> ${dateStr}</p>
                    <p style="margin: 5px 0; color: #555;"><strong>Time:</strong> ${seminar.time}</p>
                    <p style="margin: 5px 0; color: #555;"><strong>Duration:</strong> ${seminar.duration}</p>
                    <p style="margin: 5px 0; color: #555;"><strong>Speaker:</strong> ${seminar.speaker_name}</p>
                    <p style="margin: 5px 0; color: #555;"><strong>Location:</strong> ${seminar.location_type === 'online' ? 'Online' : seminar.venue_address}</p>
                </div>

                <div style="background: #fff3e0; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
                    <h3 style="margin: 0 0 15px 0; color: #e65100;">Student Registration Link</h3>
                    <p style="color: #555; margin: 0 0 15px 0;">
                        Share this link with your students to register for the seminar:
                    </p>
                    <div style="background: #fff; padding: 15px; border-radius: 8px; word-break: break-all;">
                        <a href="${registrationLink}" style="color: #1976d2; text-decoration: none; font-weight: bold;">
                            ${registrationLink}
                        </a>
                    </div>
                </div>

                <div style="background: #e3f2fd; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
                    <h4 style="margin: 0 0 10px 0; color: #1565c0;">What happens next?</h4>
                    <ol style="margin: 0; padding-left: 20px; color: #555;">
                        <li>Share the registration link with your students</li>
                        <li>Students register using their email (OTP verification)</li>
                        <li>After the seminar, mark attendance in the admin panel</li>
                        <li>Enable certificates for students to download</li>
                    </ol>
                </div>

                <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                    If you have any questions, contact us at official@zecurx.com<br>
                    Seminar ID: ${seminar.id}
                </p>
            </div>
        `;

        try {
            await resend.emails.send({
                from: 'ZecurX Private Limited <official@zecurx.com>',
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
