import { PDFDocument } from 'pdf-lib';
import { query, getClient } from '@/lib/db';
import { uploadToS3, deleteFromS3 } from '@/lib/s3';
import { CertificateTemplate } from '@/types/seminar';

// Matches the default certificate template dimensions (landscape, in PDF points)
const TEMPLATE_PAGE_WIDTH = 1440;
const TEMPLATE_PAGE_HEIGHT = 810;

export const ALLOWED_TEMPLATE_MIME_TYPES = ['image/png', 'image/jpeg'];
export const MAX_TEMPLATE_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export class CertificateTemplateValidationError extends Error {}
export class CertificateTemplateNotFoundError extends Error {}

/**
 * Wraps a background image into a single-page PDF matching the certificate
 * template dimensions, so it can be used directly by generateCertificatePDF.
 * The image is scaled to cover the full page (cropping overflow), same as a
 * background image would be used in the default design.
 */
export async function buildTemplatePdfFromImage(imageBuffer: Buffer, mimeType: string): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([TEMPLATE_PAGE_WIDTH, TEMPLATE_PAGE_HEIGHT]);

    const image = mimeType === 'image/png'
        ? await pdfDoc.embedPng(imageBuffer)
        : await pdfDoc.embedJpg(imageBuffer);

    const scale = Math.max(TEMPLATE_PAGE_WIDTH / image.width, TEMPLATE_PAGE_HEIGHT / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;

    page.drawImage(image, {
        x: (TEMPLATE_PAGE_WIDTH - drawWidth) / 2,
        y: (TEMPLATE_PAGE_HEIGHT - drawHeight) / 2,
        width: drawWidth,
        height: drawHeight,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}

export function validateTemplateFile(mimeType: string, size: number): void {
    if (!ALLOWED_TEMPLATE_MIME_TYPES.includes(mimeType)) {
        throw new CertificateTemplateValidationError('Unsupported file type. Please upload a PNG or JPEG image.');
    }
    if (size > MAX_TEMPLATE_FILE_SIZE) {
        throw new CertificateTemplateValidationError(`File too large. Maximum size is ${MAX_TEMPLATE_FILE_SIZE / (1024 * 1024)}MB.`);
    }
    if (size <= 0) {
        throw new CertificateTemplateValidationError('Empty file.');
    }
}

export async function listCertificateTemplates(): Promise<CertificateTemplate[]> {
    const result = await query<CertificateTemplate>(
        `SELECT * FROM seminar.certificate_templates ORDER BY created_at DESC`
    );
    return result.rows;
}

export async function getCertificateTemplateById(id: string): Promise<CertificateTemplate | null> {
    const result = await query<CertificateTemplate>(
        `SELECT * FROM seminar.certificate_templates WHERE id = $1`,
        [id]
    );
    return result.rows[0] || null;
}

export async function getDefaultCertificateTemplate(): Promise<CertificateTemplate | null> {
    const result = await query<CertificateTemplate>(
        `SELECT * FROM seminar.certificate_templates WHERE is_default = true ORDER BY created_at DESC LIMIT 1`
    );
    return result.rows[0] || null;
}

/**
 * Resolves the template a specific seminar should use for certificate
 * generation: its own explicit selection if set, otherwise the library
 * default, otherwise null (caller falls back to the bundled default assets).
 */
export async function getCertificateTemplateForSeminar(seminarId: string): Promise<CertificateTemplate | null> {
    const seminarResult = await query<{ certificate_template_id: string | null }>(
        `SELECT certificate_template_id FROM seminar.seminars WHERE id = $1`,
        [seminarId]
    );
    const explicitId = seminarResult.rows[0]?.certificate_template_id;

    if (explicitId) {
        const explicitTemplate = await getCertificateTemplateById(explicitId);
        if (explicitTemplate) return explicitTemplate;
    }

    return getDefaultCertificateTemplate();
}

export async function uploadCertificateTemplate(params: {
    buffer: Buffer;
    mimeType: string;
    filename: string;
    name?: string;
    setAsDefault?: boolean;
    uploadedById?: string | null;
    uploadedByEmail?: string | null;
    seminarId?: string | null;
}): Promise<CertificateTemplate> {
    validateTemplateFile(params.mimeType, params.buffer.length);

    const pdfBuffer = await buildTemplatePdfFromImage(params.buffer, params.mimeType);

    const extension = params.mimeType === 'image/png' ? 'png' : 'jpg';
    const versionKey = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const [imageUpload, pdfUpload] = await Promise.all([
        uploadToS3(
            params.buffer,
            `templates/certificate/${versionKey}.${extension}`,
            params.mimeType,
            { cacheControl: 'public, max-age=31536000' }
        ),
        uploadToS3(
            pdfBuffer,
            `templates/certificate/${versionKey}.pdf`,
            'application/pdf',
            { cacheControl: 'public, max-age=31536000' }
        ),
    ]);

    const client = await getClient();
    try {
        await client.query('BEGIN');

        const existingDefault = await client.query(`SELECT id FROM seminar.certificate_templates WHERE is_default = true LIMIT 1`);
        const shouldBeDefault = params.setAsDefault || existingDefault.rows.length === 0;

        if (shouldBeDefault) {
            await client.query(`UPDATE seminar.certificate_templates SET is_default = false WHERE is_default = true`);
        }

        const result = await client.query<CertificateTemplate>(
            `INSERT INTO seminar.certificate_templates (
                name, original_filename, mime_type, file_size,
                image_key, image_url, pdf_key, pdf_url,
                is_default, uploaded_by_id, uploaded_by_email, uploaded_from_seminar_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *`,
            [
                params.name || params.filename,
                params.filename,
                params.mimeType,
                params.buffer.length,
                imageUpload.key,
                imageUpload.url,
                pdfUpload.key,
                pdfUpload.url,
                shouldBeDefault,
                params.uploadedById || null,
                params.uploadedByEmail || null,
                params.seminarId || null,
            ]
        );
        await client.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function setDefaultCertificateTemplate(templateId: string): Promise<CertificateTemplate> {
    const client = await getClient();
    try {
        await client.query('BEGIN');

        const existing = await client.query<CertificateTemplate>(
            `SELECT * FROM seminar.certificate_templates WHERE id = $1`,
            [templateId]
        );
        if (!existing.rows[0]) {
            throw new CertificateTemplateNotFoundError('Template not found');
        }

        await client.query(`UPDATE seminar.certificate_templates SET is_default = false WHERE is_default = true`);
        const result = await client.query<CertificateTemplate>(
            `UPDATE seminar.certificate_templates SET is_default = true WHERE id = $1 RETURNING *`,
            [templateId]
        );

        await client.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function deleteCertificateTemplate(templateId: string): Promise<void> {
    const template = await getCertificateTemplateById(templateId);
    if (!template) {
        throw new CertificateTemplateNotFoundError('Template not found');
    }

    // Seminars referencing this template fall back to the library default
    // (or the bundled default) automatically via ON DELETE SET NULL.
    await query(`DELETE FROM seminar.certificate_templates WHERE id = $1`, [templateId]);

    await Promise.all([
        deleteFromS3(template.image_key).catch((err) => console.error('Failed to delete template image from S3:', err)),
        deleteFromS3(template.pdf_key).catch((err) => console.error('Failed to delete template PDF from S3:', err)),
    ]);
}
