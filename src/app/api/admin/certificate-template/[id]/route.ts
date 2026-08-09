import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, getClientIP, getUserAgent } from '@/lib/auth';
import { logCRUD } from '@/lib/audit';
import {
    setDefaultCertificateTemplate,
    deleteCertificateTemplate,
    CertificateTemplateNotFoundError,
} from '@/lib/certificate-template';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requirePermission('seminars', 'update', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { session } = authResult;

    try {
        const { id } = await params;
        const body = await request.json();

        if (body.isDefault !== true) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
        }

        const template = await setDefaultCertificateTemplate(id);

        const ipAddress = getClientIP(request);
        const userAgent = getUserAgent(request);
        await logCRUD(
            { id: session.sub, email: session.email, role: session.role },
            'update',
            'certificate_template',
            template.id,
            { is_default: true },
            ipAddress,
            userAgent
        );

        return NextResponse.json({ success: true, template });
    } catch (error) {
        if (error instanceof CertificateTemplateNotFoundError) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        console.error('Failed to set default certificate template:', error);
        return NextResponse.json({ error: 'Failed to set default certificate template' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requirePermission('seminars', 'delete', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { session } = authResult;

    try {
        const { id } = await params;
        await deleteCertificateTemplate(id);

        const ipAddress = getClientIP(request);
        const userAgent = getUserAgent(request);
        await logCRUD(
            { id: session.sub, email: session.email, role: session.role },
            'delete',
            'certificate_template',
            id,
            undefined,
            ipAddress,
            userAgent
        );

        return NextResponse.json({ success: true, message: 'Certificate template deleted' });
    } catch (error) {
        if (error instanceof CertificateTemplateNotFoundError) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        console.error('Failed to delete certificate template:', error);
        return NextResponse.json({ error: 'Failed to delete certificate template' }, { status: 500 });
    }
}
