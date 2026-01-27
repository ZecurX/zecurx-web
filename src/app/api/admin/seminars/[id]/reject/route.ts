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
        const body = await request.json();
        const { reason } = body;

        if (!reason) {
            return NextResponse.json(
                { error: 'Rejection reason is required' },
                { status: 400 }
            );
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const result = await query<Seminar>(
            `UPDATE seminar.seminars 
             SET status = 'rejected', rejection_reason = $1, updated_at = NOW()
             WHERE id = $2 AND status = 'pending'
             RETURNING *`,
            [reason, id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Seminar not found or already processed' },
                { status: 404 }
            );
        }

        const seminar = result.rows[0];

        const rejectionEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1a1a1a; margin: 0;">ZecurX</h1>
                    <p style="color: #666; margin: 5px 0 0 0;">Cybersecurity Excellence</p>
                </div>

                <div style="background: #ffebee; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #c62828; margin: 0 0 10px 0;">Seminar Request Update</h2>
                    <p style="color: #555; margin: 0;">Unfortunately, we couldn't approve your seminar request at this time.</p>
                </div>

                <div style="background: #f5f5f5; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
                    <h3 style="margin: 0 0 15px 0; color: #1a1a1a;">${seminar.title}</h3>
                    <p style="margin: 5px 0; color: #555;"><strong>Organization:</strong> ${seminar.organization_name}</p>
                    <p style="margin: 5px 0; color: #555;"><strong>Requested Date:</strong> ${new Date(seminar.date).toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
                </div>

                <div style="background: #fff; padding: 25px; border: 1px solid #e0e0e0; border-radius: 12px; margin-bottom: 25px;">
                    <h4 style="margin: 0 0 10px 0; color: #333;">Reason:</h4>
                    <p style="color: #555; margin: 0;">${reason}</p>
                </div>

                <div style="background: #e3f2fd; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
                    <h4 style="margin: 0 0 10px 0; color: #1565c0;">What can you do?</h4>
                    <ul style="margin: 0; padding-left: 20px; color: #555;">
                        <li>Review the feedback and adjust your requirements</li>
                        <li>Submit a new booking request with the changes</li>
                        <li>Contact us at official@zecurx.com for further discussion</li>
                    </ul>
                </div>

                <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                    We appreciate your interest in ZecurX and hope to work with you soon.
                </p>
            </div>
        `;

        try {
            await resend.emails.send({
                from: 'ZecurX <official@zecurx.com>',
                to: seminar.contact_email,
                subject: `Seminar Request Update: ${seminar.title} - ZecurX`,
                html: rejectionEmailHtml,
            });
        } catch (emailError) {
            console.error('Failed to send rejection email:', emailError);
        }

        return NextResponse.json({
            success: true,
            message: 'Seminar rejected',
            seminar,
        });

    } catch (error) {
        console.error('Failed to reject seminar:', error);
        return NextResponse.json(
            { error: 'Failed to reject seminar' },
            { status: 500 }
        );
    }
}
