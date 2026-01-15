import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
// import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

/*
 * EMAIL SENDING API ROUTE
 * 
 * TODO: SMTP Configuration (To be implemented by friend)
 * 
 * Required environment variables:
 * - SMTP_HOST: SMTP server host (e.g., smtp.gmail.com)
 * - SMTP_PORT: SMTP port (e.g., 587)
 * - SMTP_SECURE: true/false for TLS
 * - SMTP_USER: SMTP username/email
 * - SMTP_PASSWORD: SMTP password or app password
 * - EMAIL_FROM: From email address
 * - EMAIL_FROM_NAME: From name (e.g., "Zecurx Team")
 * 
 * Example .env configuration:
 * SMTP_HOST=smtp.gmail.com
 * SMTP_PORT=587
 * SMTP_SECURE=false
 * SMTP_USER=your-email@gmail.com
 * SMTP_PASSWORD=your-app-specific-password
 * EMAIL_FROM=noreply@zecurx.com
 * EMAIL_FROM_NAME=Zecurx Team
 */

// Uncomment when SMTP is configured:
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT || '587'),
//   secure: process.env.SMTP_SECURE === 'true',
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

// POST - Send email
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            to,
            subject,
            htmlBody,
            textBody,
            leadId,
            leadType, // 'STUDENT' or 'ENTERPRISE'
            emailType,
            sentBy
        } = body;

        // Validation
        if (!to || !subject || (!htmlBody && !textBody)) {
            return NextResponse.json(
                { error: 'Missing required fields: to, subject, and body (htmlBody or textBody)' },
                { status: 400 }
            );
        }

        /*
         * TODO: Uncomment when SMTP is configured
         * 
         * // Send email
         * await transporter.sendMail({
         *   from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
         *   to,
         *   subject,
         *   text: textBody,
         *   html: htmlBody,
         * });
         */

        // For now, just log to database (SMTP not configured yet)
        console.log('[EMAIL] Would send email:', { to, subject, leadType });

        // Log email in database if lead info provided
        if (leadId && leadType) {
            const emailTable = leadType === 'STUDENT'
                ? 'student_lead_emails'
                : 'enterprise_lead_emails';

            await supabase.from(emailTable).insert({
                lead_id: leadId,
                subject,
                body: htmlBody || textBody,
                email_type: emailType || 'MANUAL',
                sent_by: sentBy || null,
                from_email: process.env.EMAIL_FROM || 'noreply@zecurx.com',
                to_email: to,
                status: 'PENDING', // Changed to PENDING since SMTP not configured
            });

            // Log activity
            const activityTable = leadType === 'STUDENT'
                ? 'student_lead_activities'
                : 'enterprise_lead_activities';

            await supabase.from(activityTable).insert({
                lead_id: leadId,
                activity_type: 'EMAIL_QUEUED',
                description: `Email queued: ${subject} (SMTP pending configuration)`,
                performed_by: sentBy || null,
            });
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

// Helper function to get and populate email template
export async function getEmailTemplate(templateName: string, variables: Record<string, string>) {
    const { data: template, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('name', templateName)
        .eq('is_active', true)
        .single();

    if (error || !template) {
        return null;
    }

    // Replace variables in subject and body
    let subject = template.subject;
    let body = template.body;

    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        subject = subject.replace(regex, value || '');
        body = body.replace(regex, value || '');
    });

    return { subject, body, template };
}
