import { NextRequest, NextResponse } from 'next/server';
import { getCertificateById, regenerateCertificatePDF } from '@/lib/certificate';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ certificateId: string }> }
) {
    try {
        const { certificateId } = await params;

        const certificate = await getCertificateById(certificateId);
        if (!certificate) {
            return NextResponse.json(
                { error: 'Certificate not found' },
                { status: 404 }
            );
        }

        if (certificate.pdf_url) {
            return NextResponse.redirect(certificate.pdf_url);
        }

        const pdfBuffer = await regenerateCertificatePDF(certificate);

        return new NextResponse(new Uint8Array(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${certificateId}.pdf"`,
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error('Error serving certificate:', error);
        return NextResponse.json(
            { error: 'Certificate not found' },
            { status: 404 }
        );
    }
}
