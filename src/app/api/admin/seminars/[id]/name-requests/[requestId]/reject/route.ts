import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { CertificateNameRequest } from '@/types/seminar';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; requestId: string }> }
) {
    const authResult = await requirePermission('seminars', 'update', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id: seminarId, requestId } = await params;
        const body = await request.json();
        const { reason } = body;

        const reqResult = await query<CertificateNameRequest>(
            `SELECT * FROM seminar.certificate_name_requests 
             WHERE id = $1 AND seminar_id = $2`,
            [requestId, seminarId]
        );

        if (reqResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'Name request not found' },
                { status: 404 }
            );
        }

        const nameRequest = reqResult.rows[0];

        if (nameRequest.status !== 'pending') {
            return NextResponse.json(
                { error: `Request has already been ${nameRequest.status}` },
                { status: 400 }
            );
        }

        await query(
            `UPDATE seminar.certificate_name_requests 
             SET status = 'rejected', admin_notes = $1, reviewed_at = NOW(), reviewed_by = $2
             WHERE id = $3`,
            [reason || null, authResult.session.sub, requestId]
        );

        return NextResponse.json({
            success: true,
            message: 'Name request rejected',
        });

    } catch (error) {
        console.error('Failed to reject name request:', error);
        return NextResponse.json(
            { error: 'Failed to reject name request' },
            { status: 500 }
        );
    }
}
