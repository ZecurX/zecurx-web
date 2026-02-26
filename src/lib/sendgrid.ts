import sgMail, { ResponseError } from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
    sgMail.setApiKey(apiKey);
}

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
    if (!apiKey) {
        throw new Error('SENDGRID_API_KEY is not configured. Add it to your environment variables.');
    }

    const msg = {
        to: options.to,
        from: options.from || 'ZecurX Cybersecurity Private Limited <official@zecurx.com>',
        subject: options.subject,
        html: options.html,
        ...(options.replyTo && { replyTo: options.replyTo }),
        ...(options.attachments && options.attachments.length > 0 && { attachments: options.attachments }),
    };

    try {
        await sgMail.send(msg);
    } catch (err) {
        const error = err as ResponseError;
        const sgBody = error.response?.body as { errors?: { message: string }[] } | undefined;
        const details = sgBody?.errors?.map(e => e.message).join('; ')
            || error.message
            || 'Unknown SendGrid error';
        throw new Error(`SendGrid email failed: ${details}`);
    }
}
