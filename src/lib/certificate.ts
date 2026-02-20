import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';
import { query } from '@/lib/db';
import { Certificate, Seminar } from '@/types/seminar';
import { Resend } from 'resend';
import { uploadToS3 } from '@/lib/s3';
import { fetchFromCdn } from '@/lib/cdn';
import { brandedEmailTemplate, emailSection, emailCourseCatalog } from '@/lib/email-template';
import { courses } from '@/lib/courses';

interface CertificateData {
    recipientName: string;
    recipientEmail: string;
    seminarTitle: string;
    seminarTopic: string;
    seminarDate: Date;
    speakerName: string | null;
    organization: string | null;
    seminarId: string;
    registrationId: string | null;
    feedbackId: string | null;
    location?: string;
}

export function generateCertificateId(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let random = '';
    for (let i = 0; i < 5; i++) {
        random += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `ZX-${random}`;
}

export async function generateCertificatePDF(data: CertificateData & { certificateId: string }): Promise<Buffer> {
    const templateBytes = await fetchFromCdn('templates/certificate-template.pdf');
    if (!templateBytes) {
        throw new Error('Failed to fetch certificate template from CDN');
    }
    const pdfDoc = await PDFDocument.load(templateBytes);
    const page = pdfDoc.getPage(0);

    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const { width } = page.getSize();
    // Template is 1440 x 810 points, landscape
    const cx = width / 2;

    const white = rgb(1, 1, 1);

    const issuedDate = new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const seminarDate = new Date(data.seminarDate).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    // --- Participant Name (centered, large, in the blank area below "presented to") ---
    const nameFontSize = data.recipientName.length > 25 ? 32 : 40;
    const nameWidth = helveticaBold.widthOfTextAtSize(data.recipientName, nameFontSize);
    page.drawText(data.recipientName, {
        x: cx - nameWidth / 2,
        y: 460,
        size: nameFontSize,
        font: helveticaBold,
        color: white,
    });

    // --- Seminar Title (centered, after "demonstrated interest in") ---
    const titleFontSize = data.seminarTitle.length > 40 ? 20 : 24;
    const titleLines = splitTextToLines(data.seminarTitle, 60);
    let titleY = 320;
    for (const line of titleLines) {
        const lineWidth = helveticaBold.widthOfTextAtSize(line, titleFontSize);
        page.drawText(line, {
            x: cx - lineWidth / 2,
            y: titleY,
            size: titleFontSize,
            font: helveticaBold,
            color: white,
        });
        titleY -= titleFontSize + 6;
    }

    // --- Left Column: Issue Date & Certificate ID ---
    const labelX1 = 120;
    const labelFontSize = 16;
    const valueFontSize = 24;

    // Issue Date Label
    page.drawText('Issue Date:', { x: labelX1, y: 155, size: labelFontSize, font: helvetica, color: white });
    // Issue Date Value
    page.drawText(issuedDate, { x: labelX1, y: 130, size: valueFontSize, font: helveticaBold, color: white });

    // Certificate ID Label
    page.drawText('Certificate ID:', { x: labelX1, y: 105, size: labelFontSize, font: helvetica, color: white });
    // Certificate ID Value
    page.drawText(data.certificateId, { x: labelX1, y: 80, size: valueFontSize, font: helveticaBold, color: white });

    // --- Right Column: Seminar Date & Place ---
    const labelX2 = 1150;

    // Seminar Date Label
    page.drawText('Date:', { x: labelX2, y: 155, size: labelFontSize, font: helvetica, color: white });
    // Seminar Date Value
    page.drawText(seminarDate, { x: labelX2, y: 130, size: valueFontSize, font: helveticaBold, color: white });

    // Place Label
    page.drawText('Place:', { x: labelX2, y: 105, size: labelFontSize, font: helvetica, color: white });
    // Place Value
    const placeText = data.location || 'India';
    page.drawText(placeText, { x: labelX2, y: 80, size: valueFontSize, font: helveticaBold, color: white });

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

function escapeXml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function generateCertificatePreview(certificate: Certificate & { location?: string }): Promise<Buffer> {
    // Preview image dimensions: 2x of PDF points (1440x810) for sharp rendering
    const W = 2880;
    const H = 1620;
    const cx = W / 2;
    // Scale factor from PDF points to preview pixels
    const _S = 2;

    const bgBuffer = await fetchFromCdn('images/certificate-bg.png');
    if (!bgBuffer) {
        throw new Error('Failed to fetch certificate background from CDN');
    }

    const name = escapeXml(certificate.recipient_name);
    const nameSize = certificate.recipient_name.length > 25 ? 64 : 80;

    const titleLines = splitTextToLines(certificate.seminar_title, 60);
    const titleFontSize = certificate.seminar_title.length > 40 ? 40 : 48;

    const issuedDate = escapeXml(new Date().toLocaleDateString('en-US', {
        day: 'numeric', month: 'long', year: 'numeric',
    }));

    const seminarDate = escapeXml(new Date(certificate.seminar_date).toLocaleDateString('en-US', {
        day: 'numeric', month: 'long', year: 'numeric',
    }));

    // Assume location might be passed via certificate object extension or default
    const placeText = escapeXml(certificate.location || 'India');

    let titleSvg = '';
    // Y = (810 - 320) * 2 = 490 * 2 = 980
    let titleY = 980;
    for (const line of titleLines) {
        titleSvg += `<text x="${cx}" y="${titleY}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="${titleFontSize}" fill="white">${escapeXml(line)}</text>`;
        titleY += titleFontSize + 12;
    }

    // Coordinates logic: Y_svg = (810 - Y_pdf) * 2
    // Label Y=155 -> Svg Y = (810 - 155)*2 = 1310
    // Value Y=130 -> Svg Y = (810 - 130)*2 = 1360
    // Label Y=105 -> Svg Y = (810 - 105)*2 = 1410
    // Value Y=80  -> Svg Y = (810 - 80)*2 = 1460

    // X1 = 120 * 2 = 240
    const x1 = 120 * 2;
    // X2 = 1150 * 2 = 2300
    const x2 = 1150 * 2;

    // Font Sizes:
    // Label: 16 * 2 = 32
    // Value: 24 * 2 = 48

    const svgOverlay = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
        <!-- Name: Y = (810 - 460) * 2 = 700 -->
        <text x="${cx}" y="700" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="${nameSize}" fill="white">${name}</text>

        ${titleSvg}

        <!-- Left Column -->
        <text x="${x1}" y="1310" font-family="Helvetica, Arial, sans-serif" font-size="32" fill="white">Issue Date:</text>
        <text x="${x1}" y="1360" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="48" fill="white">${issuedDate}</text>

        <text x="${x1}" y="1410" font-family="Helvetica, Arial, sans-serif" font-size="32" fill="white">Certificate ID:</text>
        <text x="${x1}" y="1460" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="48" fill="white">${escapeXml(certificate.certificate_id)}</text>

        <!-- Right Column -->
        <text x="${x2}" y="1310" font-family="Helvetica, Arial, sans-serif" font-size="32" fill="white">Date:</text>
        <text x="${x2}" y="1360" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="48" fill="white">${seminarDate}</text>

        <text x="${x2}" y="1410" font-family="Helvetica, Arial, sans-serif" font-size="32" fill="white">Place:</text>
        <text x="${x2}" y="1460" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="48" fill="white">${placeText}</text>
    </svg>`;

    const svgBuffer = Buffer.from(svgOverlay);

    const result = await sharp(bgBuffer)
        .resize(W, H)
        .composite([{ input: svgBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();

    return result;
}

export async function createCertificate(data: CertificateData): Promise<Certificate> {
    const certificateId = generateCertificateId();

    const pdfBuffer = await generateCertificatePDF({
        ...data,
        certificateId,
    });

    const { url: pdfUrl } = await uploadToS3(
        pdfBuffer,
        `certificates/${certificateId}.pdf`,
        'application/pdf',
        { cacheControl: 'public, max-age=3600' }
    );

    const result = await query<Certificate>(
        `INSERT INTO seminar.certificates (
            registration_id, feedback_id, seminar_id, certificate_id,
            recipient_name, recipient_email, seminar_title, seminar_date,
            speaker_name, organization, pdf_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
            pdfUrl,
        ]
    );

    const certificate = result.rows[0];

    return { ...certificate, pdfBuffer } as Certificate & { pdfBuffer: Buffer };
}

export async function getCertificateById(certificateId: string): Promise<Certificate | null> {
    // Join with seminars table to get location metadata for preview
    const result = await query<Certificate & { location_type?: string, venue_address?: string }>(
        `SELECT c.*, s.location_type, s.venue_address 
         FROM seminar.certificates c
         LEFT JOIN seminar.seminars s ON c.seminar_id = s.id
         WHERE c.certificate_id = $1`,
        [certificateId]
    );

    if (!result.rows[0]) return null;

    const row = result.rows[0];
    let location = 'India';

    if (row.location_type === 'online') {
        location = 'Online';
    } else if (row.venue_address) {
        location = row.venue_address;
    }

    return { ...row, location } as Certificate & { location: string };
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
    const seminarResult = await query<Seminar>(
        `SELECT * FROM seminar.seminars WHERE id = $1`,
        [certificate.seminar_id]
    );

    const seminar = seminarResult.rows[0];
    const seminarTopic = seminar?.topic || 'Cybersecurity';

    let location = 'India';
    if (seminar) {
        if (seminar.location_type === 'online') {
            location = 'Online';
        } else if (seminar.venue_address) {
            location = seminar.venue_address;
        }
    }

    const pdfBuffer = await generateCertificatePDF({
        recipientName: certificate.recipient_name,
        recipientEmail: certificate.recipient_email,
        seminarTitle: certificate.seminar_title,
        seminarTopic,
        seminarDate: new Date(certificate.seminar_date),
        speakerName: certificate.speaker_name,
        organization: certificate.organization,
        seminarId: certificate.seminar_id,
        registrationId: certificate.registration_id,
        feedbackId: certificate.feedback_id,
        certificateId: certificate.certificate_id,
        location,
    });

    const { url: pdfUrl } = await uploadToS3(
        pdfBuffer,
        `certificates/${certificate.certificate_id}.pdf`,
        'application/pdf',
        { cacheControl: 'public, max-age=3600' }
    );

    await query(
        `UPDATE seminar.certificates SET pdf_url = $1 WHERE certificate_id = $2`,
        [pdfUrl, certificate.certificate_id]
    );

    return pdfBuffer;
}

export async function sendCertificateEmail(
    certificate: Certificate & { pdfBuffer?: Buffer },
    recipientEmail: string,
    promoCode?: string | null
): Promise<boolean> {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const pdfBuffer = certificate.pdfBuffer || await regenerateCertificatePDF(certificate);

    const formattedDate = new Date(certificate.seminar_date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const bodyContent = `
        <h1 style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 24px; font-weight: bold; text-align: center;">
            Congratulations, ${certificate.recipient_name}!
        </h1>
        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
            Your certificate of participation has been generated for the seminar:
        </p>
        
        ${emailSection(
            certificate.seminar_title,
            `<p style="color: #888888; margin: 0; font-size: 14px;">${formattedDate}${certificate.speaker_name ? ` • ${certificate.speaker_name}` : ''}</p>`
        )}
        
        <p style="color: #666666; font-size: 14px; margin: 20px 0 0 0; text-align: center;">
            Your certificate is attached to this email as a PDF file.
        </p>
        
        <p style="color: #999999; font-size: 12px; margin: 20px 0 0 0; text-align: center;">
            Certificate ID: <strong style="color: #666666;">${certificate.certificate_id}</strong>
        </p>
        
        ${promoCode ? `
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
                                <span style="font-family: 'Courier New', monospace; font-size: 22px; font-weight: bold; color: #15803d; letter-spacing: 2px;">${promoCode}</span>
                            </td>
                        </tr>
                    </table>
                    <p style="color: #888888; margin: 12px 0 0 0; font-size: 12px;">
                        Single use &bull; Valid for 20 days &bull; Apply at checkout on <a href="https://www.zecurx.com/academy" style="color: #15803d; text-decoration: underline;">ZecurX Academy</a>
                    </p>
                </td>
            </tr>
        </table>
        ` : ''}
        
        ${emailCourseCatalog(courses.slice(0, 4).map(course => ({
            title: course.title,
            description: course.description,
            level: course.level,
            logo: course.logo
        })))}
    `;

     const html = brandedEmailTemplate({
         accent: 'certificate',
         body: bodyContent,
         previewText: 'Your Certificate of Participation',
         includeMarketing: true,
         marketingType: 'student',
         showSocials: true,
     });

    try {
        await resend.emails.send({
            from: 'ZecurX Cybersecurity Private Limited <official@zecurx.com>',
            to: recipientEmail,
            subject: `Your Certificate of Participation - ${certificate.seminar_title}`,
            html,
            attachments: [
                {
                    filename: `ZecurX-Certificate-${certificate.certificate_id}.pdf`,
                    content: pdfBuffer,
                },
            ],
        });
        return true;
    } catch (error) {
        console.error('Failed to send certificate email:', error);
        return false;
    }
}

export async function generateFeedbackPromoCode(): Promise<string | null> {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const maxAttempts = 5;
    const DISCOUNT_PERCENT = 5;
    const MAX_USES = 1;
    const EXPIRY_DAYS = 20;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        let random = '';
        for (let i = 0; i < 6; i++) {
            random += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const code = `ZX-FB-${random}`;

        const existing = await query(
            `SELECT id FROM public.referral_codes WHERE code = $1`,
            [code]
        );

        if (existing.rows.length > 0) continue;

        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + EXPIRY_DAYS);

        try {
            await query(
                `INSERT INTO public.referral_codes (
                    code, discount_type, discount_value, min_order_amount,
                    max_discount, max_uses, valid_from, valid_until, is_active
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                    code,
                    'percentage',
                    DISCOUNT_PERCENT,
                    0,
                    null,
                    MAX_USES,
                    new Date().toISOString(),
                    validUntil.toISOString(),
                    true,
                ]
            );
            return code;
        } catch (err) {
            console.error(`Promo code generation attempt ${attempt + 1} failed:`, err);
            continue;
        }
    }

    console.error(`Failed to generate unique promo code after ${maxAttempts} attempts`);
    return null;
}

export async function sendCoordinatorCertificateAlert(params: {
    coordinatorName: string;
    coordinatorEmail: string;
    seminarTitle: string;
    seminarId: string;
    certificatePageUrl: string;
}): Promise<boolean> {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const bodyContent = `
        <p style="color: #333333; font-size: 16px; margin: 0 0 20px 0;">
            Hi ${params.coordinatorName},
        </p>
        <p style="color: #666666; font-size: 15px; line-height: 1.6; margin: 0 0 25px 0;">
            Certificates of participation are now available for download for your seminar. Please share the link below with your participants so they can claim their certificates.
        </p>

        ${emailSection(params.seminarTitle, '')}

        ${emailSection(
            'How it works:',
            `
            <ol style="margin: 0; padding-left: 20px; color: #555555; font-size: 14px; line-height: 1.8;">
                <li>Share the certificate link below with your participants</li>
                <li>Participants verify their email and submit feedback</li>
                <li>Their certificate is generated and emailed to them</li>
            </ol>
            `
        )}

        <p style="color: #999999; font-size: 12px; margin: 20px 0 0 0; text-align: center; word-break: break-all;">
            <a href="${params.certificatePageUrl}" style="color: #666666; text-decoration: underline;">${params.certificatePageUrl}</a>
        </p>
    `;

    const html = brandedEmailTemplate({
        accent: 'default',
        body: bodyContent,
        previewText: 'Certificates Ready for Distribution',
        cta: {
            title: 'Certificate Page',
            description: 'Share this link with your participants',
            buttonText: 'CERTIFICATE PAGE',
            buttonUrl: params.certificatePageUrl
        },
        includeMarketing: true,
        marketingType: 'corporate',
        showSocials: true,
    });

    try {
        await resend.emails.send({
            from: 'ZecurX Cybersecurity Private Limited <official@zecurx.com>',
            to: params.coordinatorEmail,
            subject: `Certificates Ready: ${params.seminarTitle} - ZecurX`,
            html,
        });
        return true;
    } catch (error) {
        console.error('Failed to send coordinator certificate alert:', error);
        return false;
    }
}
