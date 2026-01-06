import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, subject, message, formType } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Email content based on form type
        const isDemo = formType === 'demo';
        const emailSubject = isDemo
            ? `New Demo Request from ${name}`
            : `New Contact: ${subject || 'General Inquiry'}`;

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 10px;">
                    ${isDemo ? '🎯 New Demo Request' : '📧 New Contact Message'}
                </h2>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
                    <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
                    ${body.company ? `<p style="margin: 0 0 10px 0;"><strong>Company:</strong> ${body.company}</p>` : ''}
                    ${body.role ? `<p style="margin: 0 0 10px 0;"><strong>Role:</strong> ${body.role}</p>` : ''}
                    ${subject ? `<p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>` : ''}
                </div>

                <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h3 style="margin-top: 0; color: #333;">Message:</h3>
                    <p style="color: #555; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
                </div>

                <p style="color: #888; font-size: 12px; margin-top: 20px;">
                    This email was sent from the ZecurX website ${isDemo ? 'demo request' : 'contact'} form.
                </p>
            </div>
        `;

        // Send email
        await transporter.sendMail({
            from: `"ZecurX Website" <${process.env.SMTP_EMAIL}>`,
            to: process.env.SMTP_EMAIL, // Send to yourself
            replyTo: email,
            subject: emailSubject,
            html: htmlContent,
        });

        // Send confirmation email to user
        await transporter.sendMail({
            from: `"ZecurX" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: isDemo ? 'Demo Request Received - ZecurX' : 'We received your message - ZecurX',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1a1a1a;">Thank you for reaching out, ${name}!</h2>
                    <p style="color: #555; line-height: 1.6;">
                        ${isDemo
                    ? 'We have received your demo request and our team will get back to you within 24 hours to schedule a personalized demo.'
                    : 'We have received your message and will get back to you as soon as possible.'}
                    </p>
                    <p style="color: #555;">Best regards,<br>The ZecurX Team</p>
                </div>
            `,
        });

        return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}
