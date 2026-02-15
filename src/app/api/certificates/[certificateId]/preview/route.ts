import { NextRequest, NextResponse } from 'next/server';
import { getCertificateById, generateCertificatePreview } from '@/lib/certificate';

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

        const pngBuffer = await generateCertificatePreview(certificate);

        return new NextResponse(new Uint8Array(pngBuffer), {
            headers: {
                'Content-Type': 'image/png',
                'Content-Length': pngBuffer.length.toString(),
                'Cache-Control': 'public, max-age=3600',
            },
        });

    } catch (error) {
        console.error('Certificate preview error:', error);
        return NextResponse.json(
            { error: 'Failed to preview certificate' },
            { status: 500 }
        );
    }
}
