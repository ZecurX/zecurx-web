import { NextRequest, NextResponse } from 'next/server';
import { getCertificateById, regenerateCertificatePDF } from '@/lib/certificate';
import { execSync } from 'child_process';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';

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

        const id = randomUUID();
        const pdfPath = join(tmpdir(), `cert-${id}.pdf`);
        const pngBase = join(tmpdir(), `cert-${id}`);
        const pngPath = `${pngBase}.png`;

        writeFileSync(pdfPath, pdfBuffer);
        execSync(`pdftoppm -png -r 200 -singlefile "${pdfPath}" "${pngBase}"`);
        const pngBuffer = readFileSync(pngPath);

        try { unlinkSync(pdfPath); } catch {}
        try { unlinkSync(pngPath); } catch {}

        return new NextResponse(pngBuffer, {
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
