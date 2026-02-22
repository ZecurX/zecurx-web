import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendgrid';
import { verifySessionFromRequest } from '@/lib/auth';
import { brandedEmailTemplate } from '@/lib/email-template';

export async function POST(request: NextRequest) {
    // Temporarily disabled for quick testing via curl
    const session = await verifySessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { to = 'spsidharth29@gmail.com', type = 'all' } = body;

        const results = [];

        const templates = [
            {
                id: 'certificate',
                subject: '🏆 Your ZecurX Certificate is Ready!',
                options: {
                    accent: 'certificate' as const,
                    body: `
                        <h2>Congratulations!</h2>
                        <p>Hi Sidharth,</p>
                        <p>Your performance in the <strong>Advanced Ethical Hacking Masterclass</strong> was exceptional. Your official certificate of completion is now available for download.</p>
                    `,
                    cta: {
                        title: 'Download Certificate',
                        description: 'Your verified certificate is ready to be shared on LinkedIn.',
                        buttonText: 'View/Download',
                        buttonUrl: 'https://zecurx.com/seminars/test-seminar/certificate/ZX-CERT-123'
                    },
                    marketingType: 'student' as const
                }
            },
            {
                id: 'internship',
                subject: '🚀 Welcome to the Cybersecurity Internship!',
                options: {
                    accent: 'success' as const,
                    body: `
                        <h2>You're in!</h2>
                        <p>Hi Sidharth,</p>
                        <p>We are thrilled to welcome you to the 12-week <strong>Offensive Security Internship</strong> program. Get ready to dive deep into real-world penetration testing.</p>
                    `,
                    cta: {
                        title: 'Enrollment Complete',
                        description: 'Access your learning module and join the Discord community.',
                        buttonText: 'Join LMS',
                        buttonUrl: 'https://zecurx.com/portal'
                    },
                    marketingType: 'student' as const
                }
            },
            {
                id: 'corporate',
                subject: '💼 ZecurX: VAPT Service Inquiry Confirmation',
                options: {
                    accent: 'premium' as const,
                    body: `
                        <h2>Inquiry Received</h2>
                        <p>Dear Team,</p>
                        <p>Thank you for expressing interest in our <strong>Penetration Testing & Red Teaming</strong> services. Our senior security consultant will contact you within 24 hours to discuss your infrastructure needs.</p>
                    `,
                    cta: {
                        title: 'Corporate Solutions',
                        description: 'Explore our full suite of enterprise security offerings.',
                        buttonText: 'View Services',
                        buttonUrl: 'https://zecurx.com/services'
                    },
                    marketingType: 'corporate' as const
                }
            }
        ];

         for (const t of templates) {
             if (type === 'all' || type === t.id) {
                 try {
                     await sendEmail({
                         to,
                         subject: t.subject,
                         html: brandedEmailTemplate(t.options),
                     });
                     results.push({ type: t.id, success: true, id: undefined, error: undefined });
                 } catch (err) {
                     results.push({ type: t.id, success: false, id: undefined, error: err instanceof Error ? err.message : 'Send failed' });
                 }
             }
         }

        return NextResponse.json({ success: true, results });

    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
    }
}
