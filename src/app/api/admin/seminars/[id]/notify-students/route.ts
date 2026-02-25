import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { Seminar, SeminarRegistration } from '@/types/seminar';
import { sendStudentCertificateAlert } from '@/lib/certificate';

export const config = {
    maxDuration: 60,
};

const BATCH_SIZE = 5;
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requirePermission('seminars', 'update', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id: seminarId } = await params;

        const result = await query<Seminar>(
            `SELECT * FROM seminar.seminars WHERE id = $1`,
            [seminarId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Seminar not found' },
                { status: 404 }
            );
        }

        const seminar = result.rows[0];

        if (!seminar.certificate_enabled) {
            return NextResponse.json(
                { error: 'Certificates are not enabled for this seminar' },
                { status: 400 }
            );
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zecurx.com';
        const certificatePageUrl = `${baseUrl}/seminars/${seminarId}/certificate`;

        // Fetch all verified registrations
        const registrationsResult = await query<SeminarRegistration>(
            `SELECT * FROM seminar.registrations 
             WHERE seminar_id = $1 AND email_verified = true`,
            [seminarId]
        );

        const registrations = registrationsResult.rows;

        if (registrations.length === 0) {
            return NextResponse.json(
                { error: 'No verified student registrations found' },
                { status: 400 }
            );
        }

        // Send emails in batches to avoid rate limits and timeouts
        const results: { email: string; success: boolean; error?: string }[] = [];

        for (let i = 0; i < registrations.length; i += BATCH_SIZE) {
            const batch = registrations.slice(i, i + BATCH_SIZE);
            const batchResults = await Promise.all(
                batch.map(async (reg) => {
                    const result = await sendStudentCertificateAlert({
                        studentName: reg.full_name,
                        studentEmail: reg.email,
                        seminarTitle: seminar.title,
                        seminarId: seminarId,
                        certificatePageUrl,
                    });
                    return { email: reg.email, ...result };
                })
            );
            results.push(...batchResults);
        }

        const sent = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success);

        if (sent === 0) {
            // All emails failed — surface the first error for diagnosis
            const firstError = failed[0]?.error || 'Unknown error';
        return NextResponse.json({
                    error: `Failed to send emails to students: ${firstError}`,
                    details: {
                        sent: 0,
                        failed: failed.length,
                        totalRegistrations: registrations.length,
                        sampleErrors: failed.slice(0, 3).map(f => ({ email: f.email, error: f.error })),
                    },
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Certificate alert sent to ${sent}/${registrations.length} participant(s).${failed.length > 0 ? ` ${failed.length} failed.` : ''}`,
            details: {
                studentsSent: sent,
                studentsFailed: failed.length,
                totalRegistrations: registrations.length,
                ...(failed.length > 0 && {
                    failedEmails: failed.slice(0, 5).map(f => ({ email: f.email, error: f.error })),
                }),
            },
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to notify students:', message);
        return NextResponse.json(
            { error: `Failed to send student alerts: ${message}` },
            { status: 500 }
        );
    }
}
