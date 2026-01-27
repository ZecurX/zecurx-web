import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { query } from '@/lib/db';
import { Certificate } from '@/types/seminar';
import { Resend } from 'resend';

interface CertificateData {
    recipientName: string;
    recipientEmail: string;
    seminarTitle: string;
    seminarDate: Date;
    speakerName: string | null;
    organization: string | null;
    seminarId: string;
    registrationId: string | null;
    feedbackId: string | null;
}

export function generateCertificateId(): string {
    const year = new Date().getFullYear();
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let random = '';
    for (let i = 0; i < 6; i++) {
        random += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `ZX-SEM-${year}-${random}`;
}

export async function generateCertificatePDF(data: CertificateData & { certificateId: string }): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 Landscape

    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

    const { width, height } = page.getSize();

    const darkColor = rgb(0.1, 0.1, 0.15);
    const goldColor = rgb(0.85, 0.65, 0.13);
    const grayColor = rgb(0.4, 0.4, 0.4);

    page.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: height,
        color: rgb(0.98, 0.98, 0.98),
    });

    const borderWidth = 8;
    page.drawRectangle({
        x: 20,
        y: 20,
        width: width - 40,
        height: height - 40,
        borderColor: darkColor,
        borderWidth: borderWidth,
    });

    page.drawRectangle({
        x: 30,
        y: 30,
        width: width - 60,
        height: height - 60,
        borderColor: goldColor,
        borderWidth: 2,
    });

    let y = height - 80;

    page.drawText('ZECURX', {
        x: width / 2 - 60,
        y,
        size: 28,
        font: helveticaBold,
        color: darkColor,
    });

    y -= 25;
    page.drawText('Cybersecurity Excellence', {
        x: width / 2 - 72,
        y,
        size: 12,
        font: helvetica,
        color: grayColor,
    });

    y -= 50;
    page.drawText('CERTIFICATE OF PARTICIPATION', {
        x: width / 2 - 165,
        y,
        size: 24,
        font: helveticaBold,
        color: goldColor,
    });

    y -= 40;
    page.drawText('This is to certify that', {
        x: width / 2 - 65,
        y,
        size: 14,
        font: timesItalic,
        color: grayColor,
    });

    y -= 50;
    const nameWidth = timesRoman.widthOfTextAtSize(data.recipientName, 36);
    page.drawText(data.recipientName, {
        x: (width - nameWidth) / 2,
        y,
        size: 36,
        font: timesRoman,
        color: darkColor,
    });

    y -= 8;
    page.drawLine({
        start: { x: width / 2 - 150, y },
        end: { x: width / 2 + 150, y },
        thickness: 1,
        color: goldColor,
    });

    y -= 35;
    page.drawText('has successfully participated in the seminar', {
        x: width / 2 - 130,
        y,
        size: 14,
        font: timesItalic,
        color: grayColor,
    });

    y -= 40;
    const titleLines = splitTextToLines(data.seminarTitle, 60);
    for (const line of titleLines) {
        const lineWidth = helveticaBold.widthOfTextAtSize(line, 20);
        page.drawText(line, {
            x: (width - lineWidth) / 2,
            y,
            size: 20,
            font: helveticaBold,
            color: darkColor,
        });
        y -= 28;
    }

    y -= 10;
    const dateStr = data.seminarDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const dateText = `held on ${dateStr}`;
    const dateWidth = timesRoman.widthOfTextAtSize(dateText, 14);
    page.drawText(dateText, {
        x: (width - dateWidth) / 2,
        y,
        size: 14,
        font: timesRoman,
        color: grayColor,
    });

    if (data.speakerName) {
        y -= 25;
        const speakerText = `conducted by ${data.speakerName}`;
        const speakerWidth = timesItalic.widthOfTextAtSize(speakerText, 12);
        page.drawText(speakerText, {
            x: (width - speakerWidth) / 2,
            y,
            size: 12,
            font: timesItalic,
            color: grayColor,
        });
    }

    if (data.organization) {
        y -= 20;
        const orgText = `at ${data.organization}`;
        const orgWidth = timesRoman.widthOfTextAtSize(orgText, 12);
        page.drawText(orgText, {
            x: (width - orgWidth) / 2,
            y,
            size: 12,
            font: timesRoman,
            color: grayColor,
        });
    }

    const footerY = 60;

    page.drawText('_______________________', {
        x: 120,
        y: footerY + 30,
        size: 12,
        font: helvetica,
        color: grayColor,
    });
    page.drawText('Authorized Signature', {
        x: 145,
        y: footerY + 10,
        size: 10,
        font: helvetica,
        color: grayColor,
    });
    page.drawText('ZecurX Team', {
        x: 165,
        y: footerY - 5,
        size: 9,
        font: helvetica,
        color: grayColor,
    });

    const issuedDate = new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    page.drawText(`Issued: ${issuedDate}`, {
        x: width / 2 - 40,
        y: footerY + 10,
        size: 9,
        font: helvetica,
        color: grayColor,
    });

    page.drawText(`Certificate ID: ${data.certificateId}`, {
        x: width - 220,
        y: footerY + 30,
        size: 10,
        font: helveticaBold,
        color: darkColor,
    });

    page.drawText(`Verify at: zecurx.com/verify/${data.certificateId}`, {
        x: width - 235,
        y: footerY + 10,
        size: 9,
        font: helvetica,
        color: grayColor,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}

function splitTextToLines(text: string, maxChars: number): string[] {
    if (text.length <= maxChars) return [text];
    
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
        if ((currentLine + ' ' + word).trim().length <= maxChars) {
            currentLine = (currentLine + ' ' + word).trim();
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine) lines.push(currentLine);

    return lines;
}

export async function createCertificate(data: CertificateData): Promise<Certificate> {
    const certificateId = generateCertificateId();

    const pdfBuffer = await generateCertificatePDF({
        ...data,
        certificateId,
    });

    const result = await query<Certificate>(
        `INSERT INTO seminar.certificates (
            registration_id, feedback_id, seminar_id, certificate_id,
            recipient_name, recipient_email, seminar_title, seminar_date,
            speaker_name, organization
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
            data.registrationId,
            data.feedbackId,
            data.seminarId,
            certificateId,
            data.recipientName,
            data.recipientEmail,
            data.seminarTitle,
            data.seminarDate.toISOString().split('T')[0],
            data.speakerName,
            data.organization,
        ]
    );

    const certificate = result.rows[0];

    return { ...certificate, pdfBuffer } as Certificate & { pdfBuffer: Buffer };
}

export async function getCertificateById(certificateId: string): Promise<Certificate | null> {
    const result = await query<Certificate>(
        `SELECT * FROM seminar.certificates WHERE certificate_id = $1`,
        [certificateId]
    );
    return result.rows[0] || null;
}

export async function incrementDownloadCount(certificateId: string): Promise<void> {
    await query(
        `UPDATE seminar.certificates 
         SET download_count = download_count + 1, last_downloaded_at = NOW()
         WHERE certificate_id = $1`,
        [certificateId]
    );
}

export async function regenerateCertificatePDF(certificate: Certificate): Promise<Buffer> {
    return generateCertificatePDF({
        recipientName: certificate.recipient_name,
        recipientEmail: certificate.recipient_email,
        seminarTitle: certificate.seminar_title,
        seminarDate: new Date(certificate.seminar_date),
        speakerName: certificate.speaker_name,
        organization: certificate.organization,
        seminarId: certificate.seminar_id,
        registrationId: certificate.registration_id,
        feedbackId: certificate.feedback_id,
        certificateId: certificate.certificate_id,
    });
}

export async function sendCertificateEmail(
    certificate: Certificate & { pdfBuffer?: Buffer },
    recipientEmail: string
): Promise<boolean> {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const pdfBuffer = certificate.pdfBuffer || await regenerateCertificatePDF(certificate);

    const verifyUrl = `https://www.zecurx.com/verify/${certificate.certificate_id}`;
    const formattedDate = new Date(certificate.seminar_date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1a1a1a; margin: 0; font-size: 28px;">ZecurX</h1>
                <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Cybersecurity Excellence</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 16px; padding: 40px; text-align: center;">
                <div style="width: 80px; height: 80px; background: #d4af37; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 40px;">🏆</span>
                </div>
                
                <h2 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 24px;">
                    Congratulations, ${certificate.recipient_name}!
                </h2>
                
                <p style="color: #666; margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">
                    Your certificate of participation has been generated for the seminar:
                </p>
                
                <div style="background: #ffffff; border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 1px solid #e0e0e0;">
                    <h3 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 18px;">
                        ${certificate.seminar_title}
                    </h3>
                    <p style="color: #888; margin: 0; font-size: 14px;">
                        ${formattedDate}${certificate.speaker_name ? ` • ${certificate.speaker_name}` : ''}
                    </p>
                </div>
                
                <p style="color: #666; font-size: 14px; margin: 0 0 20px 0;">
                    Your certificate is attached to this email as a PDF file.
                </p>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <p style="color: #666; font-size: 14px; margin: 0 0 15px 0;">
                    <strong>Certificate ID:</strong> ${certificate.certificate_id}
                </p>
                <a href="${verifyUrl}" style="display: inline-block; background: #1a1a1a; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; font-size: 14px;">
                    Verify Certificate Online
                </a>
            </div>
            
            <div style="margin-top: 40px; padding: 20px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                    This certificate can be verified at <a href="${verifyUrl}" style="color: #666;">${verifyUrl}</a>
                </p>
                <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
                    Thank you for participating in our seminar. We hope to see you again!
                </p>
            </div>
        </div>
    `;

    try {
        await resend.emails.send({
            from: 'ZecurX Certificates <official@zecurx.com>',
            to: recipientEmail,
            subject: `Your Certificate of Participation - ${certificate.seminar_title}`,
            html,
            attachments: [
                {
                    filename: `ZecurX-Certificate-${certificate.certificate_id}.pdf`,
                    content: pdfBuffer.toString('base64'),
                },
            ],
        });
        return true;
    } catch (error) {
        console.error('Failed to send certificate email:', error);
        return false;
    }
}
