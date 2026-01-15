import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            to,
            subject,
            htmlBody,
            textBody,
            leadId,
            leadType,
            emailType,
            sentBy
        } = body;

        if (!to || !subject || (!htmlBody && !textBody)) {
            return NextResponse.json(
                { error: 'Missing required fields: to, subject, and body (htmlBody or textBody)' },
                { status: 400 }
            );
        }

        console.log('[EMAIL] Would send email:', { to, subject, leadType });

        if (leadId && leadType) {
            const emailTable = leadType === 'STUDENT'
                ? 'student_lead_emails'
                : 'enterprise_lead_emails';

            await query(
                `INSERT INTO ${emailTable} (lead_id, subject, body, email_type, sent_by, from_email, to_email, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    leadId,
                    subject,
                    htmlBody || textBody,
                    emailType || 'MANUAL',
                    sentBy || null,
                    process.env.EMAIL_FROM || 'noreply@zecurx.com',
                    to,
                    'PENDING',
                ]
            );

            const activityTable = leadType === 'STUDENT'
                ? 'student_lead_activities'
                : 'enterprise_lead_activities';

            await query(
                `INSERT INTO ${activityTable} (lead_id, activity_type, description, performed_by)
                 VALUES ($1, $2, $3, $4)`,
                [
                    leadId,
                    'EMAIL_QUEUED',
                    `Email queued: ${subject} (SMTP pending configuration)`,
                    sentBy || null,
                ]
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Email logged (SMTP configuration pending)'
        });
    } catch (error) {
        console.error('Error processing email:', error);
        return NextResponse.json(
            { error: 'Failed to process email' },
            { status: 500 }
        );
    }
}

export async function getEmailTemplate(templateName: string, variables: Record<string, string>) {
    const result = await query<{ subject: string; body: string }>(
        `SELECT * FROM email_templates WHERE name = $1 AND is_active = true`,
        [templateName]
    );

    const template = result.rows[0];
    if (!template) {
        return null;
    }

    let subject = template.subject;
    let body = template.body;

    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        subject = subject.replace(regex, value || '');
        body = body.replace(regex, value || '');
    });

    return { subject, body, template };
}
