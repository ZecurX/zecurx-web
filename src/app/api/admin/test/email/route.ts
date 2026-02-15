import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { success: false, error: 'Email address required' },
                { status: 400 }
            );
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: 'ZecurX Private Limited <official@zecurx.com>',
            to: email,
            subject: '🧪 ZecurX System Test - Email Delivery',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                        <img src="https://www.zecurx.com/images/zecurx-logo.png" alt="ZecurX" style="height: 36px; display: block; margin: 0 auto;" />
                        <p style="color: #888; margin: 12px 0 0 0; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">System Test</p>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
                        <h2 style="color: #1a1a1a; margin: 0 0 15px 0;">✅ Email Test Successful!</h2>
                        <p style="color: #555; line-height: 1.6;">
                            This is a test email from the ZecurX admin system test panel.
                            If you're receiving this, the email integration is working correctly.
                        </p>
                        <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; margin-top: 20px;">
                            <p style="margin: 0; font-size: 12px; color: #888;">
                                <strong>Timestamp:</strong> ${new Date().toISOString()}<br>
                                <strong>Provider:</strong> Resend API
                            </p>
                        </div>
                    </div>
                </div>
            `,
        });

        if (error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Test email sent to ${email}`,
            details: {
                messageId: data?.id,
                recipient: email,
            },
        });
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
