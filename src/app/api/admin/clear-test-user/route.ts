import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySessionFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const session = await verifySessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const testEmail = 'windroexe@gmail.com';

        // Delete from seminar.certificates (where email is recipient_email)
        const certResult = await query(
            'DELETE FROM seminar.certificates WHERE recipient_email = $1',
            [testEmail]
        );

        // Delete from zecurx_admin.student_leads
        const studentResult = await query(
            'DELETE FROM student_leads WHERE email = $1',
            [testEmail]
        );

        // Delete from zecurx_admin.enterprise_leads
        const enterpriseResult = await query(
            'DELETE FROM enterprise_leads WHERE email = $1',
            [testEmail]
        );

        // Verify
        const certCheck = await query(
            'SELECT COUNT(*) FROM seminar.certificates WHERE recipient_email = $1',
            [testEmail]
        );
        const studentCheck = await query(
            'SELECT COUNT(*) FROM student_leads WHERE email = $1',
            [testEmail]
        );
        const enterpriseCheck = await query(
            'SELECT COUNT(*) FROM enterprise_leads WHERE email = $1',
            [testEmail]
        );

        return NextResponse.json({
            success: true,
            message: `Cleared all data for ${testEmail}`,
            deleted: {
                certificates: certResult.rowCount || 0,
                studentFeedback: studentResult.rowCount || 0,
                enterpriseFeedback: enterpriseResult.rowCount || 0,
            },
            remaining: {
                certificates: parseInt(certCheck.rows[0]?.count || '0'),
                studentFeedback: parseInt(studentCheck.rows[0]?.count || '0'),
                enterpriseFeedback: parseInt(enterpriseCheck.rows[0]?.count || '0'),
            },
        });
    } catch (error) {
        console.error('Clear user error:', error);
        return NextResponse.json(
            { error: 'Failed to clear user data. Check server logs.' },
            { status: 500 }
        );
    }
}
