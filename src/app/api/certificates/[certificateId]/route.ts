import { NextRequest, NextResponse } from 'next/server';
import { getCertificateById } from '@/lib/certificate';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ certificateId: string }> }
) {
    try {
        const { certificateId } = await params;

        const certificate = await getCertificateById(certificateId);

        if (!certificate) {
            return NextResponse.json({
                valid: false,
                certificate: null,
            });
        }

        return NextResponse.json({
            valid: true,
            certificate: {
                certificateId: certificate.certificate_id,
                recipientName: certificate.recipient_name,
                seminarTitle: certificate.seminar_title,
                seminarDate: certificate.seminar_date,
                speakerName: certificate.speaker_name,
                organization: certificate.organization,
                issuedAt: certificate.generated_at,
            },
        });

    } catch (error) {
        console.error('Certificate verification error:', error);
        return NextResponse.json(
            { error: 'Failed to verify certificate' },
            { status: 500 }
        );
    }
}
