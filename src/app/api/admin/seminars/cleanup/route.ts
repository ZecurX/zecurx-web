import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { deleteFromS3 } from '@/lib/s3';
import { Certificate } from '@/types/seminar';

export async function POST(request: NextRequest) {
    const authResult = await requirePermission('seminars', 'write', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const oldCerts = await query<Certificate>(
            `SELECT * FROM seminar.certificates
             WHERE generated_at < NOW() - INTERVAL '30 days'`
        );

        if (oldCerts.rows.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No data older than 30 days found.',
                deleted: { certificates: 0, feedback: 0, nameRequests: 0, promoCodes: 0, s3Files: 0 },
            });
        }

        const certIds = oldCerts.rows.map(c => c.certificate_id);
        const feedbackIds = oldCerts.rows.map(c => c.feedback_id).filter(Boolean) as string[];

        let s3Deleted = 0;
        for (const cert of oldCerts.rows) {
            try {
                await deleteFromS3(`certificates/${cert.certificate_id}.pdf`);
                s3Deleted++;
            } catch {
                // PDF may not exist on S3 (legacy local storage)
            }
        }

        let nameRequestsDeleted = 0;
        if (feedbackIds.length > 0) {
            const nrResult = await query(
                `DELETE FROM seminar.certificate_name_requests
                 WHERE feedback_id = ANY($1::uuid[])`,
                [feedbackIds]
            );
            nameRequestsDeleted = nrResult.rowCount || 0;
        }

        const certDeleteResult = await query(
            `DELETE FROM seminar.certificates
             WHERE certificate_id = ANY($1::text[])`,
            [certIds]
        );

        let feedbackDeleted = 0;
        if (feedbackIds.length > 0) {
            const fbResult = await query(
                `DELETE FROM seminar.feedback
                 WHERE id = ANY($1::uuid[])`,
                [feedbackIds]
            );
            feedbackDeleted = fbResult.rowCount || 0;
        }

        const promoResult = await query(
            `DELETE FROM public.referral_codes
             WHERE code LIKE 'ZX-FB-%'
             AND created_at < NOW() - INTERVAL '30 days'`
        );

        return NextResponse.json({
            success: true,
            message: `Cleaned up ${oldCerts.rows.length} certificate(s) and associated data.`,
            deleted: {
                certificates: certDeleteResult.rowCount || 0,
                feedback: feedbackDeleted,
                nameRequests: nameRequestsDeleted,
                promoCodes: promoResult.rowCount || 0,
                s3Files: s3Deleted,
            },
        });
    } catch (error) {
        console.error('Cleanup error:', error);
        return NextResponse.json(
            { error: 'Cleanup failed. Check server logs.' },
            { status: 500 }
        );
    }
}
