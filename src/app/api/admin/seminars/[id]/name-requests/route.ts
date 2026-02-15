import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { CertificateNameRequest } from '@/types/seminar';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requirePermission('seminars', 'read', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id: seminarId } = await params;

        const result = await query<CertificateNameRequest>(
            `SELECT * FROM seminar.certificate_name_requests 
             WHERE seminar_id = $1 
             ORDER BY created_at DESC`,
            [seminarId]
        );

        return NextResponse.json({
            success: true,
            nameRequests: result.rows,
        });

    } catch (error) {
        console.error('Failed to fetch name requests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch name requests' },
            { status: 500 }
        );
    }
}
