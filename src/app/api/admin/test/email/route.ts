
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendgrid';
import { verifySessionFromRequest } from '@/lib/auth';
import { brandedEmailTemplate } from '@/lib/email-template';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const session = await verifySessionFromRequest(request);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { success: false, error: 'Email address required' },
                { status: 400 }
            );
        }



        const testEmailBody = `
            <h2 style="color: #1a1a1a; margin: 0 0 15px 0;">✅ Email Test Successful!</h2>
            <p style="color: #555; line-height: 1.6;">
                This is a test email from the ZecurX admin system test panel.
                If you're receiving this, the email integration is working correctly.
            </p>
            <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; margin-top: 20px;">
                <p style="margin: 0; font-size: 12px; color: #888;">
                    <strong>Timestamp: </strong> ${new Date().toISOString()}<br>
                    <strong>Provider: </strong> SendGrid API
                </p>
            </div>
        `;

        const testEmailHtml = brandedEmailTemplate({
            accent: 'default',
            body: testEmailBody,
            previewText: '🧪 ZecurX System Test - Email Delivery',
            includeMarketing: false,
        });

        try {
            await sendEmail({
                to: email,
                subject: '🧪 ZecurX System Test - Email Delivery',
                html: testEmailHtml,
            });
        return NextResponse.json({
                success: true,
                message: `Test email sent to ${email}`,
                details: {
                    recipient: email,
                },
            });
        } catch (sendError) {
            return NextResponse.json(
                { success: false, error: sendError instanceof Error ? sendError.message : 'Failed to send email' },
                { status: 500 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to send email',
            },
            { status: 500 }
        );
    }
}
