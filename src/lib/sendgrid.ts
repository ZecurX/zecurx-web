import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface EmailAttachment {
    content: string;
    filename: string;
    type: string;
    disposition: 'attachment';
}

interface SendEmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
    replyTo?: string;
    attachments?: EmailAttachment[];
}

/**
 * Convert a Buffer attachment to SendGrid's base64 format.
 */
export function toSendGridAttachment(
    buffer: Buffer,
    filename: string,
    mimeType: string = 'application/pdf'
): EmailAttachment {
    return {
        content: buffer.toString('base64'),
        filename,
        type: mimeType,
        disposition: 'attachment',
    };
}

/**
 * Send an email via SendGrid.
 * Centralizes all email sending so transport can be swapped in one place.
 */
export async function sendEmail(options: SendEmailOptions): Promise<void> {
    const msg = {
        to: options.to,
        from: options.from || 'ZecurX Cybersecurity Private Limited <official@zecurx.com>',
        subject: options.subject,
        html: options.html,
        ...(options.replyTo && { replyTo: options.replyTo }),
        ...(options.attachments && options.attachments.length > 0 && { attachments: options.attachments }),
    };

    await sgMail.send(msg);
}
