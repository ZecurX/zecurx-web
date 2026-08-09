import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, getClientIP, getUserAgent } from '@/lib/auth';
import { logCRUD } from '@/lib/audit';
import {
    listCertificateTemplates,
    uploadCertificateTemplate,
    CertificateTemplateValidationError,
} from '@/lib/certificate-template';

export async function GET(request: NextRequest) {
    const authResult = await requirePermission('seminars', 'read', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const templates = await listCertificateTemplates();
        return NextResponse.json({ success: true, templates });
    } catch (error) {
        console.error('Failed to fetch certificate templates:', error);
        return NextResponse.json({ error: 'Failed to fetch certificate templates' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const authResult = await requirePermission('seminars', 'create', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { session } = authResult;

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const seminarId = formData.get('seminarId') as string | null;
        const name = formData.get('name') as string | null;
        const setAsDefault = formData.get('setAsDefault') === 'true';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const template = await uploadCertificateTemplate({
            buffer,
            mimeType: file.type,
            filename: file.name,
            name: name || undefined,
            setAsDefault,
            uploadedById: session.sub,
            uploadedByEmail: session.email,
            seminarId: seminarId || null,
        });

        const ipAddress = getClientIP(request);
        const userAgent = getUserAgent(request);
        await logCRUD(
            { id: session.sub, email: session.email, role: session.role },
            'create',
            'certificate_template',
            template.id,
            { original_filename: template.original_filename, uploaded_from_seminar_id: seminarId || null, is_default: template.is_default },
            ipAddress,
            userAgent
        );

        return NextResponse.json({
            success: true,
            message: 'Certificate template uploaded.',
            template,
        }, { status: 201 });
    } catch (error) {
        if (error instanceof CertificateTemplateValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        console.error('Failed to upload certificate template:', error);
        return NextResponse.json({ error: 'Failed to upload certificate template' }, { status: 500 });
    }
}
