import { NextRequest, NextResponse } from 'next/server';
import { brandedEmailTemplate, emailSection, emailCourseCatalog } from '@/lib/email-template';
import { Resend } from 'resend';
import { courses } from '@/lib/courses';

export async function POST(request: NextRequest) {
    try {
        const { email = 'windroexe@gmail.com', type = 'both' } = await request.json();

        const resend = new Resend(process.env.RESEND_API_KEY);
        const sentEmails = [];

        // Send Registration Success Email
        if (type === 'both' || type === 'registration') {
            const registrationHtml = brandedEmailTemplate({
                accent: 'success',
                body: `
                    <h2 style="color: #2e7d32; margin: 0 0 16px 0; font-size: 22px; text-align: center;">
                        ✓ Registration Confirmed!
                    </h2>
                    <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0; text-align: center;">
                        You're all set for the seminar.
                    </p>

                    ${emailSection('Hands-on Penetration Testing Workshop', `
                        <table width="100%" style="border-collapse: collapse;">
                            <tr><td style="padding: 6px 0; color: #666;"><strong>Date:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">May 20, 2026</td></tr>
                            <tr><td style="padding: 6px 0; color: #666;"><strong>Time:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">10:00 AM</td></tr>
                            <tr><td style="padding: 6px 0; color: #666;"><strong>Duration:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">2 hours</td></tr>
                            <tr><td style="padding: 6px 0; color: #666;"><strong>Speaker:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">John Doe, Security Expert</td></tr>
                            <tr><td style="padding: 6px 0; color: #666;"><strong>Location:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">Online</td></tr>
                        </table>
                    `)}

                    <p style="color: #666; font-size: 14px; margin: 20px 0;">
                        <strong>Important reminders:</strong>
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.8;">
                        <li>Please arrive 10 minutes before the scheduled time</li>
                        <li>Bring your student/employee ID for verification</li>
                        <li>Certificates will be available after the seminar</li>
                    </ul>

                    <p style="color: #999; font-size: 12px; margin: 20px 0 0 0; text-align: center;">
                        Registration ID: test-reg-123456
                    </p>

                    ${emailCourseCatalog(courses.slice(0, 4).map(course => ({
                        title: course.title,
                        description: course.description,
                        level: course.level,
                        logo: course.logo
                    })))}
                `,
                previewText: 'Registration Confirmed: Hands-on Penetration Testing Workshop',
                cta: {
                    title: 'Add to Calendar',
                    description: 'Save the seminar to your Google Calendar',
                    buttonText: 'ADD TO GOOGLE CALENDAR',
                    buttonUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Test%20Seminar'
                },
                includeMarketing: true,
                marketingType: 'student',
                showSocials: false,
            });

            await resend.emails.send({
                from: 'ZecurX Cybersecurity Private Limited <official@zecurx.com>',
                to: email,
                subject: 'Registration Confirmed: Hands-on Penetration Testing Workshop - ZecurX',
                html: registrationHtml,
            });
            sentEmails.push('registration');
        }

        // Send Certificate Email
        if (type === 'both' || type === 'certificate') {
            const certificateHtml = brandedEmailTemplate({
                accent: 'certificate',
                body: `
                    <h1 style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 24px; font-weight: bold; text-align: center;">
                        Congratulations, Test User!
                    </h1>
                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
                        Your certificate of participation has been generated for the seminar:
                    </p>
                    
                    ${emailSection(
                        'Hands-on Penetration Testing Workshop',
                        `<p style="color: #888888; margin: 0; font-size: 14px;">May 20, 2026 • John Doe</p>`
                    )}
                    
                    <p style="color: #666666; font-size: 14px; margin: 20px 0 0 0; text-align: center;">
                        Your certificate is attached to this email as a PDF file.
                    </p>
                    
                    <p style="color: #999999; font-size: 12px; margin: 20px 0 0 0; text-align: center;">
                        Certificate ID: <strong style="color: #666666;">ZX-TEST123</strong>
                    </p>
                    
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 20px; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1px solid #bbf7d0; border-radius: 8px;">
                        <tr>
                            <td style="padding: 20px; text-align: center;">
                                <p style="color: #15803d; margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Exclusive Offer</p>
                                <p style="color: #333333; margin: 0 0 12px 0; font-size: 16px; line-height: 1.5;">
                                    As a thank you for your feedback, enjoy <strong>5% off</strong> any ZecurX Academy course!
                                </p>
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                    <tr>
                                        <td style="background-color: #ffffff; border: 2px dashed #22c55e; border-radius: 6px; padding: 12px 24px;">
                                            <span style="font-family: 'Courier New', monospace; font-size: 22px; font-weight: bold; color: #15803d; letter-spacing: 2px;">ZX-FB-TEST</span>
                                        </td>
                                    </tr>
                                </table>
                                <p style="color: #888888; margin: 12px 0 0 0; font-size: 12px;">
                                    Single use • Valid for 20 days • Apply at checkout on <a href="https://www.zecurx.com/academy" style="color: #15803d; text-decoration: underline;">ZecurX Academy</a>
                                </p>
                            </td>
                        </tr>
                    </table>

                    ${emailCourseCatalog(courses.slice(0, 4).map(course => ({
                        title: course.title,
                        description: course.description,
                        level: course.level,
                        logo: course.logo
                    })))}
                `,
                previewText: 'Your Certificate of Participation',
                includeMarketing: true,
                marketingType: 'corporate',
                showSocials: true,
            });

            await resend.emails.send({
                from: 'ZecurX Cybersecurity Private Limited <official@zecurx.com>',
                to: email,
                subject: 'Your Certificate of Participation - Hands-on Penetration Testing Workshop',
                html: certificateHtml,
            });
            sentEmails.push('certificate');
        }

        return NextResponse.json({
            success: true,
            message: `Sent ${sentEmails.join(' and ')} email(s) to ${email}`,
            sentEmails,
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to send test emails' },
            { status: 500 }
        );
    }
}
