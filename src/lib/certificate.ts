import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';
import { query } from '@/lib/db';
import { Certificate } from '@/types/seminar';
import { Resend } from 'resend';
import { CDN_ASSETS } from '@/lib/cdn';

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
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let random = '';
    for (let i = 0; i < 5; i++) {
        random += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `ZX-${random}`;
}

export async function generateCertificatePDF(data: CertificateData & { certificateId: string }): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]);

    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
    const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const timesBoldItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);

    const { width, height } = page.getSize();

    const [bgResponse, sigResponse] = await Promise.all([
        fetch(CDN_ASSETS.certificates.background),
        fetch(CDN_ASSETS.certificates.signature),
    ]);
    if (!bgResponse.ok) throw new Error('Failed to fetch certificate background from CDN');
    if (!sigResponse.ok) throw new Error('Failed to fetch signature from CDN');

    const [bgBytes, sigBytes] = await Promise.all([
        bgResponse.arrayBuffer().then(b => new Uint8Array(b)),
        sigResponse.arrayBuffer().then(b => new Uint8Array(b)),
    ]);

    const bgImage = await pdfDoc.embedPng(bgBytes);
    const sigImage = await pdfDoc.embedPng(sigBytes);

    page.drawImage(bgImage, { x: 0, y: 0, width, height });

    const white = rgb(1, 1, 1);
    const lightWhite = rgb(0.85, 0.88, 0.92);
    const darkNavy = rgb(0.04, 0.08, 0.15);
    const blue = rgb(0.13, 0.59, 0.95);
    const darkGray = rgb(0.3, 0.32, 0.36);
    const medGray = rgb(0.45, 0.47, 0.5);
    const lightGray = rgb(0.6, 0.62, 0.65);

    const cx = width / 2;

    const headerTitle = 'CERTIFICATE OF PARTICIPATION';
    const headerTitleW = helveticaBold.widthOfTextAtSize(headerTitle, 16);
    page.drawText(headerTitle, {
        x: cx - headerTitleW / 2,
        y: height - 88,
        size: 16,
        font: helveticaBold,
        color: white,
    });

    const headerSub = 'ZecurX Private Limited';
    const headerSubW = helvetica.widthOfTextAtSize(headerSub, 9);
    page.drawText(headerSub, {
        x: cx - headerSubW / 2,
        y: height - 103,
        size: 9,
        font: helvetica,
        color: lightWhite,
    });

    let y = height - 160;

    const certifyText = 'This is to certify that';
    const certifyWidth = timesItalic.widthOfTextAtSize(certifyText, 14);
    page.drawText(certifyText, {
        x: cx - certifyWidth / 2,
        y,
        size: 14,
        font: timesItalic,
        color: medGray,
    });

    y -= 55;
    const nameSize = data.recipientName.length > 25 ? 30 : 36;
    const nameWidth = timesBoldItalic.widthOfTextAtSize(data.recipientName, nameSize);
    page.drawText(data.recipientName, {
        x: cx - nameWidth / 2,
        y,
        size: nameSize,
        font: timesBoldItalic,
        color: darkNavy,
    });

    y -= 14;
    const nameLineW = Math.min(nameWidth + 50, 400);
    page.drawLine({
        start: { x: cx - nameLineW / 2, y },
        end: { x: cx + nameLineW / 2, y },
        thickness: 1,
        color: blue,
    });

    y -= 38;
    const partText = 'has successfully participated in the seminar';
    const partWidth = timesItalic.widthOfTextAtSize(partText, 13);
    page.drawText(partText, {
        x: cx - partWidth / 2,
        y,
        size: 13,
        font: timesItalic,
        color: medGray,
    });

    y -= 42;
    const titleLines = splitTextToLines(data.seminarTitle, 55);
    for (const line of titleLines) {
        const lineWidth = timesBold.widthOfTextAtSize(line, 19);
        page.drawText(line, {
            x: cx - lineWidth / 2,
            y,
            size: 19,
            font: timesBold,
            color: darkNavy,
        });
        y -= 28;
    }

    y -= 10;
    const dateStr = data.seminarDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const dateParts: { text: string; font: typeof timesRoman }[] = [
        { text: 'held on ', font: timesRoman },
        { text: dateStr, font: timesBold },
    ];
    if (data.speakerName) {
        dateParts.push({ text: '  |  conducted by ', font: timesRoman });
        dateParts.push({ text: data.speakerName, font: timesBold });
    }
    let dateLineWidth = 0;
    for (const p of dateParts) dateLineWidth += p.font.widthOfTextAtSize(p.text, 11);
    let dx = cx - dateLineWidth / 2;
    for (const p of dateParts) {
        const w = p.font.widthOfTextAtSize(p.text, 11);
        page.drawText(p.text, { x: dx, y, size: 11, font: p.font, color: darkGray });
        dx += w;
    }

    if (data.organization) {
        y -= 18;
        const orgText = `at ${data.organization}`;
        const orgWidth = timesItalic.widthOfTextAtSize(orgText, 11);
        page.drawText(orgText, {
            x: cx - orgWidth / 2,
            y,
            size: 11,
            font: timesItalic,
            color: lightGray,
        });
    }

    const footerY = 58;

    const sigW = 140;
    const sigH = sigW * (sigImage.height / sigImage.width);
    page.drawImage(sigImage, {
        x: 130,
        y: footerY + 40,
        width: sigW,
        height: sigH,
    });
    page.drawLine({
        start: { x: 120, y: footerY + 37 },
        end: { x: 280, y: footerY + 37 },
        thickness: 0.5,
        color: blue,
    });
    const sigLabel = 'Authorized Signature';
    const sigLabelW = helvetica.widthOfTextAtSize(sigLabel, 8);
    page.drawText(sigLabel, {
        x: 200 - sigLabelW / 2,
        y: footerY + 24,
        size: 8,
        font: helvetica,
        color: lightGray,
    });
    const sigName = 'Harsh Priyam';
    const sigNameW = helveticaBold.widthOfTextAtSize(sigName, 9);
    page.drawText(sigName, {
        x: 200 - sigNameW / 2,
        y: footerY + 12,
        size: 9,
        font: helveticaBold,
        color: darkNavy,
    });
    const sigOrg = 'ZecurX Private Limited';
    const sigOrgW = helvetica.widthOfTextAtSize(sigOrg, 7);
    page.drawText(sigOrg, {
        x: 200 - sigOrgW / 2,
        y: footerY + 2,
        size: 7,
        font: helvetica,
        color: lightGray,
    });

    const issuedDate = new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const issuedLabel = 'Date of Issue';
    const issuedLabelW = helvetica.widthOfTextAtSize(issuedLabel, 8);
    page.drawText(issuedLabel, {
        x: cx - issuedLabelW / 2,
        y: footerY + 24,
        size: 8,
        font: helvetica,
        color: lightGray,
    });
    const issuedDateW = helveticaBold.widthOfTextAtSize(issuedDate, 9);
    page.drawText(issuedDate, {
        x: cx - issuedDateW / 2,
        y: footerY + 12,
        size: 9,
        font: helveticaBold,
        color: darkNavy,
    });

    const certIdLabel = 'Certificate ID';
    const certIdLabelW = helvetica.widthOfTextAtSize(certIdLabel, 8);
    const rightColX = width - 140;
    page.drawText(certIdLabel, {
        x: rightColX - certIdLabelW / 2,
        y: footerY + 24,
        size: 8,
        font: helvetica,
        color: lightGray,
    });
    const certIdVal = data.certificateId;
    const certIdValW = helveticaBold.widthOfTextAtSize(certIdVal, 11);
    page.drawText(certIdVal, {
        x: rightColX - certIdValW / 2,
        y: footerY + 12,
        size: 11,
        font: helveticaBold,
        color: darkNavy,
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

function escapeXml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function generateCertificatePreview(certificate: Certificate): Promise<Buffer> {
    const W = 1684;
    const H = 1190;
    const cx = W / 2;

    const bgResponse = await fetch(CDN_ASSETS.certificates.background);
    if (!bgResponse.ok) throw new Error('Failed to fetch certificate background');
    const bgBuffer = Buffer.from(await bgResponse.arrayBuffer());

    const name = escapeXml(certificate.recipient_name);
    const nameSize = certificate.recipient_name.length > 25 ? 60 : 72;

    const seminarTitle = escapeXml(certificate.seminar_title);
    const titleLines = splitTextToLines(certificate.seminar_title, 55);

    const dateStr = new Date(certificate.seminar_date).toLocaleDateString('en-US', {
        day: 'numeric', month: 'long', year: 'numeric',
    });

    let dateLine = `held on ${escapeXml(dateStr)}`;
    if (certificate.speaker_name) {
        dateLine += `  |  conducted by ${escapeXml(certificate.speaker_name)}`;
    }

    const orgLine = certificate.organization ? `at ${escapeXml(certificate.organization)}` : '';
    const issuedDate = escapeXml(new Date().toLocaleDateString('en-US', {
        day: 'numeric', month: 'long', year: 'numeric',
    }));

    let titleSvg = '';
    let titleY = 598;
    for (const line of titleLines) {
        titleSvg += `<text x="${cx}" y="${titleY}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="38" fill="#0a1428">${escapeXml(line)}</text>`;
        titleY += 46;
    }

    const svgOverlay = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
        <text x="${cx}" y="176" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="32" fill="white" letter-spacing="2">CERTIFICATE OF PARTICIPATION</text>
        <text x="${cx}" y="206" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="18" fill="#d9dee8">ZecurX Private Limited</text>

        <text x="${cx}" y="340" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="28" fill="#737880">This is to certify that</text>

        <text x="${cx}" y="440" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-style="italic" font-size="${nameSize}" fill="#0a1428">${name}</text>
        <line x1="${cx - 200}" y1="460" x2="${cx + 200}" y2="460" stroke="#2196f3" stroke-width="2"/>

        <text x="${cx}" y="530" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="26" fill="#737880">has successfully participated in the seminar</text>

        ${titleSvg}

        <text x="${cx}" y="${titleY + 30}" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#4d5258">${dateLine}</text>
        ${orgLine ? `<text x="${cx}" y="${titleY + 62}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="22" fill="#999ca0">${orgLine}</text>` : ''}

        <line x1="240" y1="1037" x2="560" y2="1037" stroke="#2196f3" stroke-width="1"/>
        <text x="400" y="1058" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="16" fill="#999ca0">Authorized Signature</text>
        <text x="400" y="1080" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="18" fill="#0a1428">Harsh Priyam</text>
        <text x="400" y="1098" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="14" fill="#999ca0">ZecurX Private Limited</text>

        <text x="${cx}" y="1058" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="16" fill="#999ca0">Date of Issue</text>
        <text x="${cx}" y="1080" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="18" fill="#0a1428">${issuedDate}</text>

        <text x="${W - 280}" y="1058" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="16" fill="#999ca0">Certificate ID</text>
        <text x="${W - 280}" y="1080" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="22" fill="#0a1428">${escapeXml(certificate.certificate_id)}</text>
    </svg>`;

    const svgBuffer = Buffer.from(svgOverlay);

    const result = await sharp(bgBuffer)
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
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Certificate of Participation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); padding: 40px 30px; text-align: center;">
                                    <img src="https://www.zecurx.com/images/zecurx-logo.png" alt="ZecurX" style="height: 40px; display: block; margin: 0 auto;" />
                                    <p style="color: #a0a0a0; margin: 15px 0 0 0; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">Cybersecurity Solutions</p>
                                </td>
                            </tr>
                            
                            <!-- Gold Accent -->
                            <tr>
                                <td style="background-color: #d4af37; height: 4px; font-size: 0; line-height: 0;">&nbsp;</td>
                            </tr>
        
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px; text-align: center;">
                                    <h1 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 24px; font-weight: bold;">
                                        Congratulations, ${certificate.recipient_name}!
                                    </h1>
                                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                        Your certificate of participation has been generated for the seminar:
                                    </p>
        
                                    <!-- Seminar Details Box -->
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 30px;">
                                        <tr>
                                            <td style="padding: 25px; text-align: center;">
                                                <h2 style="color: #333333; margin: 0 0 10px 0; font-size: 20px;">
                                                    ${certificate.seminar_title}
                                                </h2>
                                                <p style="color: #888888; margin: 0; font-size: 14px;">
                                                    ${formattedDate}${certificate.speaker_name ? ` • ${certificate.speaker_name}` : ''}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
        
                                    <p style="color: #666666; font-size: 14px; margin: 0 0 30px 0;">
                                        Your certificate is attached to this email as a PDF file.
                                    </p>
        
                                    <!-- Button -->
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="center">
                                                <a href="${verifyUrl}" style="display: inline-block; background: #0a0a0f; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                                                    Verify Certificate Online
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style="color: #999999; font-size: 12px; margin: 30px 0 0 0;">
                                        Certificate ID: <strong style="color: #666666;">${certificate.certificate_id}</strong>
                                    </p>
                                </td>
                            </tr>
        
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f4f4f4; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                                    <p style="color: #999999; font-size: 12px; margin: 0 0 10px 0; line-height: 1.5;">
                                        This certificate can be verified at:<br>
                                        <a href="${verifyUrl}" style="color: #666666; text-decoration: underline;">${verifyUrl}</a>
                                    </p>
                                    <p style="color: #999999; font-size: 12px; margin: 20px 0 0 0;">
                                        &copy; ${new Date().getFullYear()} ZecurX Private Limited. All rights reserved.<br>
                                        <a href="https://www.zecurx.com" style="color: #999999; text-decoration: none;">www.zecurx.com</a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;

    try {
        await resend.emails.send({
            from: 'ZecurX Private Limited <official@zecurx.com>',
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

export async function sendCoordinatorCertificateAlert(params: {
    coordinatorName: string;
    coordinatorEmail: string;
    seminarTitle: string;
    seminarId: string;
    certificatePageUrl: string;
}): Promise<boolean> {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Certificates Ready</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); padding: 40px 30px; text-align: center;">
                                    <img src="https://www.zecurx.com/images/zecurx-logo.png" alt="ZecurX" style="height: 40px; display: block; margin: 0 auto;" />
                                    <p style="color: #a0a0a0; margin: 15px 0 0 0; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">Cybersecurity Solutions</p>
                                </td>
                            </tr>

                            <!-- Green Accent -->
                            <tr>
                                <td style="background-color: #4caf50; height: 4px; font-size: 0; line-height: 0;">&nbsp;</td>
                            </tr>

                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <p style="color: #333333; font-size: 16px; margin: 0 0 20px 0;">
                                        Hi ${params.coordinatorName},
                                    </p>
                                    <p style="color: #666666; font-size: 15px; line-height: 1.6; margin: 0 0 25px 0;">
                                        Certificates of participation are now available for download for your seminar. Please share the link below with your participants so they can claim their certificates.
                                    </p>

                                    <!-- Seminar Details -->
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 30px;">
                                        <tr>
                                            <td style="padding: 25px;">
                                                <p style="margin: 0 0 8px 0; color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Seminar</p>
                                                <p style="margin: 0; color: #333333; font-size: 18px; font-weight: bold;">${params.seminarTitle}</p>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Instructions -->
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #e8f5e9; border: 1px solid #c8e6c9; border-radius: 8px; margin-bottom: 30px;">
                                        <tr>
                                            <td style="padding: 20px 25px;">
                                                <p style="margin: 0 0 12px 0; color: #2e7d32; font-size: 14px; font-weight: bold;">How it works:</p>
                                                <p style="margin: 0 0 8px 0; color: #555555; font-size: 14px; line-height: 1.6;">1. Share the certificate link below with your participants</p>
                                                <p style="margin: 0 0 8px 0; color: #555555; font-size: 14px; line-height: 1.6;">2. Participants verify their email and submit feedback</p>
                                                <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.6;">3. Their certificate is generated and emailed to them</p>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Button -->
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="center">
                                                <a href="${params.certificatePageUrl}" style="display: inline-block; background: #0a0a0f; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                                                    Certificate Page
                                                </a>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="color: #999999; font-size: 12px; margin: 25px 0 0 0; text-align: center; word-break: break-all;">
                                        <a href="${params.certificatePageUrl}" style="color: #666666; text-decoration: underline;">${params.certificatePageUrl}</a>
                                    </p>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f4f4f4; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                                    <p style="color: #999999; font-size: 12px; margin: 0;">
                                        &copy; ${new Date().getFullYear()} ZecurX Private Limited. All rights reserved.<br>
                                        <a href="https://www.zecurx.com" style="color: #999999; text-decoration: none;">www.zecurx.com</a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;

    try {
        await resend.emails.send({
            from: 'ZecurX Private Limited <official@zecurx.com>',
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
