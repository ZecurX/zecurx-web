import { NextRequest, NextResponse } from 'next/server';
import { getCertificateById, regenerateCertificatePDF, incrementDownloadCount } from '@/lib/certificate';

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

        const pdfBuffer = await regenerateCertificatePDF(certificate);

        await incrementDownloadCount(certificateId);

        return new NextResponse(new Uint8Array(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="ZecurX_Certificate_${certificateId}.pdf"`,
                'Content-Length': pdfBuffer.length.toString(),
            },
        });

    } catch (error) {
        console.error('Certificate download error:', error);
        return NextResponse.json(
            { error: 'Failed to download certificate' },
            { status: 500 }
        );
    }
}
