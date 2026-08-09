import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { generateCertificatePDF } from '@/lib/certificate';

// Test-only endpoint: renders a certificate PDF with admin-supplied sample
// data using the exact same rendering path as real certificate issuance
// (including the seminar's selected template), but performs no DB writes,
// no S3 upload, and no email — nothing is persisted.
export async function POST(request: NextRequest) {
    const authResult = await requirePermission('seminars', 'read', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const body = await request.json();
        const {
            seminarId,
            recipientName,
            seminarTitle,
            seminarDate,
            speakerName,
            organization,
            location,
        } = body;

        if (!seminarId || !recipientName || !seminarTitle || !seminarDate) {
            return NextResponse.json(
                { error: 'seminarId, recipientName, seminarTitle and seminarDate are required' },
                { status: 400 }
            );
        }

        const parsedDate = new Date(seminarDate);
        if (Number.isNaN(parsedDate.getTime())) {
            return NextResponse.json({ error: 'Invalid seminarDate' }, { status: 400 });
        }

        const pdfBuffer = await generateCertificatePDF({
            recipientName: String(recipientName).slice(0, 200),
            recipientEmail: 'test@example.com',
            seminarTitle: String(seminarTitle).slice(0, 300),
            seminarTopic: 'Cybersecurity',
            seminarDate: parsedDate,
            speakerName: speakerName ? String(speakerName).slice(0, 200) : null,
            organization: organization ? String(organization).slice(0, 200) : null,
            seminarId: String(seminarId),
            registrationId: null,
            feedbackId: null,
            location: location ? String(location).slice(0, 100) : undefined,
            certificateId: `TEST-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        });

        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="certificate-test-preview.pdf"',
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        console.error('Failed to generate test certificate:', error);
        return NextResponse.json({ error: 'Failed to generate test certificate' }, { status: 500 });
    }
}
