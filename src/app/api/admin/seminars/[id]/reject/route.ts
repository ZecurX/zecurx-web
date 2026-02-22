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
        const body = await request.json();
        const { reason } = body;

        if (!reason) {
            return NextResponse.json(
                { error: 'Rejection reason is required' },
                { status: 400 }
            );
        }



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

        const bodyContent = `
            <p style="color: #333; font-size: 16px; margin: 0 0 20px 0; text-align: center;">
                Unfortunately, we couldn't approve your seminar request at this time.
            </p>

            ${emailSection(seminar.title, `
                <table width="100%" style="border-collapse: collapse;">
                    <tr><td style="padding: 8px 0; color: #555; font-size: 14px;"><strong>Organization:</strong> ${seminar.organization_name}</td></tr>
                    <tr><td style="padding: 8px 0; color: #555; font-size: 14px;"><strong>Requested Date:</strong> ${new Date(seminar.date).toLocaleDateString('en-US', { dateStyle: 'full' })}</td></tr>
                </table>
            `)}

            <p style="color: #666; font-size: 14px; margin: 20px 0; font-weight: bold;">Reason:</p>
            <p style="color: #555; font-size: 14px; margin: 10px 0; padding: 15px; background-color: #f9f9f9; border-left: 3px solid #0a0a0f;">
                ${reason}
            </p>

            <p style="color: #666; font-size: 14px; margin: 20px 0;">
                <strong>What you can do:</strong>
            </p>
            <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.8;">
                <li>Review the feedback and adjust your requirements</li>
                <li>Submit a new booking request with the changes</li>
                <li>Contact us at official@zecurx.com for further discussion</li>
            </ul>

            <p style="color: #888; font-size: 13px; margin: 20px 0; text-align: center;">
                We appreciate your interest in ZecurX and hope to work with you soon.
            </p>
        `;

        const rejectionEmailHtml = brandedEmailTemplate({
            accent: 'error',
            body: bodyContent,
            previewText: `Seminar Request Update: ${seminar.title}`,
            includeMarketing: true,
            marketingType: 'corporate',
            showSocials: false,
        });

        try {
            await sendEmail({
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
