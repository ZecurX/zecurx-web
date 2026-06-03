import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { query } from '@/lib/db';
import { RESOURCES, ACTIONS } from '@/types/auth';
import { sendEmail } from '@/lib/sendgrid';
import { brandedEmailTemplate } from '@/lib/email-template';

interface Recipient {
    email: string;
    name: string;
}

async function collectRecipients(audienceTypes: string[]): Promise<Recipient[]> {
    const [studentRes, enterpriseRes, usersRes] = await Promise.all([
        audienceTypes.includes('student_leads')
            ? query<Recipient>(
                `SELECT DISTINCT email, full_name AS name FROM student_leads WHERE email IS NOT NULL AND email <> ''`)
            : Promise.resolve({ rows: [] as Recipient[] }),

        audienceTypes.includes('enterprise_leads')
            ? query<Recipient>(
                `SELECT DISTINCT email, contact_person_name AS name FROM enterprise_leads WHERE email IS NOT NULL AND email <> ''`)
            : Promise.resolve({ rows: [] as Recipient[] }),

        audienceTypes.includes('enrolled_students')
            ? query<Recipient>(
                `SELECT DISTINCT email, name FROM public.users WHERE email IS NOT NULL AND email <> ''`)
            : Promise.resolve({ rows: [] as Recipient[] }),
    ]);

    const all = [...studentRes.rows, ...enterpriseRes.rows, ...usersRes.rows];
    const seen = new Set<string>();
    return all.filter(r => {
        const key = r.email.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function personalize(template: string, recipient: Recipient): string {
    const firstName = (recipient.name || '').split(' ')[0] || 'there';
    return template
        .replace(/\{\{first_name\}\}/gi, firstName)
        .replace(/\{\{full_name\}\}/gi, recipient.name || '')
        .replace(/\{\{email\}\}/gi, recipient.email);
}

async function ensureTable(): Promise<void> {
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
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requirePermission(RESOURCES.BULK_EMAIL, ACTIONS.CREATE, req);
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await ensureTable();

        const { id } = await params;

        const campaignRes = await query(
            `SELECT * FROM zecurx_admin.bulk_email_campaigns WHERE id=$1`,
            [id]
        );

        if (!campaignRes.rows[0]) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }

        const campaign = campaignRes.rows[0];

        if (campaign.status === 'sent') {
            return NextResponse.json({ error: 'Campaign already sent' }, { status: 400 });
        }

        if (campaign.status === 'sending') {
            return NextResponse.json({ error: 'Campaign is currently sending' }, { status: 400 });
        }

        const recipients = await collectRecipients(campaign.audience_types);

        if (recipients.length === 0) {
            return NextResponse.json({ error: 'No recipients found' }, { status: 400 });
        }

        await query(
            `UPDATE zecurx_admin.bulk_email_campaigns SET status='sending', recipient_count=$1, updated_at=NOW() WHERE id=$2`,
            [recipients.length, id]
        );

        const BATCH_SIZE = 50;
        let sendError: string | null = null;

        try {
            for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
                const batch = recipients.slice(i, i + BATCH_SIZE);
                await Promise.all(
                    batch.map(recipient => {
                        const personalizedSubject = personalize(campaign.subject, recipient);
                        const personalizedBody    = personalize(campaign.body, recipient);
                        const html = brandedEmailTemplate({
                            body: personalizedBody,
                            accent: 'default',
                            includeMarketing: false,
                        });
                        return sendEmail({ to: recipient.email, subject: personalizedSubject, html });
                    })
                );
            }
        } catch (err) {
            sendError = err instanceof Error ? err.message : 'Unknown send error';
        }

        if (sendError) {
            await query(
                `UPDATE zecurx_admin.bulk_email_campaigns SET status='failed', error_message=$1, updated_at=NOW() WHERE id=$2`,
                [sendError, id]
            );
            return NextResponse.json({ error: `Send failed: ${sendError}` }, { status: 500 });
        }

        await query(
            `UPDATE zecurx_admin.bulk_email_campaigns SET status='sent', sent_at=NOW(), updated_at=NOW() WHERE id=$1`,
            [id]
        );

        const updated = await query(`SELECT * FROM zecurx_admin.bulk_email_campaigns WHERE id=$1`, [id]);
        return NextResponse.json({ campaign: updated.rows[0] });
    } catch (error) {
        console.error('Error sending campaign:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
