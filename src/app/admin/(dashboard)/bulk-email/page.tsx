import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { AdminJWTPayload, RESOURCES, ACTIONS } from '@/types/auth';
import { hasPermission } from '@/lib/permissions';
import { query } from '@/lib/db';
import BulkEmailClient from './BulkEmailClient';

export default async function BulkEmailPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session?.value) redirect('/admin/login');

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || process.env.ADMIN_PASSWORD);
        const { payload } = await jwtVerify(session.value, secret);
        const jwt = payload as unknown as AdminJWTPayload;

        if (!hasPermission(jwt.role, RESOURCES.BULK_EMAIL, ACTIONS.READ)) {
            redirect('/admin');
        }
    } catch {
        redirect('/admin/login');
    }

    let initialCampaigns: Array<{
        id: string;
        created_by_name: string;
        subject: string;
        audience_types: string[];
        recipient_count: number;
        status: string;
        scheduled_at: string | null;
        sent_at: string | null;
        created_at: string;
    }> = [];
    let totalCount = 0;

    try {
        // Auto-create table if the migration hasn't been run yet
        await query(`
            CREATE TABLE IF NOT EXISTS zecurx_admin.bulk_email_campaigns (
                id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                created_by      UUID NOT NULL,
                created_by_name TEXT NOT NULL,
                subject         TEXT NOT NULL,
                body            TEXT NOT NULL,
                audience_types  TEXT[] NOT NULL,
                recipient_count INTEGER NOT NULL DEFAULT 0,
                status          TEXT NOT NULL DEFAULT 'draft'
                                    CHECK (status IN ('draft','scheduled','sending','sent','failed')),
                scheduled_at    TIMESTAMPTZ,
                sent_at         TIMESTAMPTZ,
                error_message   TEXT,
                created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_bec_status     ON zecurx_admin.bulk_email_campaigns(status);
            CREATE INDEX IF NOT EXISTS idx_bec_created_at ON zecurx_admin.bulk_email_campaigns(created_at DESC);
        `);

        const countRes = await query<{ count: string }>(
            `SELECT COUNT(*) as count FROM zecurx_admin.bulk_email_campaigns`
        );
        totalCount = parseInt(countRes.rows[0]?.count || '0');

        const dataRes = await query<typeof initialCampaigns[number]>(
            `SELECT id, created_by_name, subject, audience_types, recipient_count, status,
                    scheduled_at, sent_at, created_at
             FROM zecurx_admin.bulk_email_campaigns
             ORDER BY created_at DESC
             LIMIT 20`
        );
        initialCampaigns = dataRes.rows;
    } catch {
        // Table may not exist yet — client component will show empty state
    }

    return <BulkEmailClient initialCampaigns={initialCampaigns} totalCount={totalCount} />;
}
