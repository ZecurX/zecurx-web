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

// Auto-create table on first use — avoids needing a manual migration run
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

// Run audience queries in parallel to avoid sequential timeouts
async function collectRecipients(
    audienceTypes: string[],
    customRecipients: Recipient[] = []
): Promise<Recipient[]> {
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

    const all: Recipient[] = [
        ...studentRes.rows,
        ...enterpriseRes.rows,
        ...usersRes.rows,
        ...customRecipients,
    ];

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

interface ParsedAttachment {
    content: string;      // base64
    filename: string;
    type: string;
    disposition: 'attachment';
}

async function sendInBatches(
    recipients: Recipient[],
    subject: string,
    emailBody: string,
    attachments: ParsedAttachment[] = []
): Promise<string | null> {
    const BATCH_SIZE = 50;
    try {
        for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
            const batch = recipients.slice(i, i + BATCH_SIZE);
            await Promise.all(
                batch.map(recipient => {
                    const personalizedSubject = personalize(subject, recipient);
                    const personalizedBody    = personalize(emailBody, recipient);
                    const html = brandedEmailTemplate({
                        body: personalizedBody,
                        accent: 'default',
                        includeMarketing: false,
                    });
                    return sendEmail({
                        to: recipient.email,
                        subject: personalizedSubject,
                        html,
                        ...(attachments.length > 0 && { attachments }),
                    });
                })
            );
        }
        return null;
    } catch (err) {
        return err instanceof Error ? err.message : 'Unknown send error';
    }
}

// GET - List all campaigns
export async function GET(req: NextRequest) {
    const auth = await requirePermission(RESOURCES.BULK_EMAIL, ACTIONS.READ, req);
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await ensureTable();

        const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
        const limit = 20;
        const offset = (page - 1) * limit;

        const [countRes, dataRes] = await Promise.all([
            query<{ count: string }>(
                `SELECT COUNT(*) as count FROM zecurx_admin.bulk_email_campaigns`
            ),
            query(
                `SELECT id, created_by_name, subject, audience_types, recipient_count, status,
                        scheduled_at, sent_at, created_at
                 FROM zecurx_admin.bulk_email_campaigns
                 ORDER BY created_at DESC
                 LIMIT $1 OFFSET $2`,
                [limit, offset]
            ),
        ]);

        const total = parseInt(countRes.rows[0]?.count || '0');

        return NextResponse.json({
            campaigns: dataRes.rows,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

// POST - Create / send / schedule / draft a campaign
export async function POST(req: NextRequest) {
    const auth = await requirePermission(RESOURCES.BULK_EMAIL, ACTIONS.CREATE, req);
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await ensureTable();

        let attachments: ParsedAttachment[] = [];

        const body = await req.json() as {
            subject: string;
            email_body: string;
            audience_types: string[];
            custom_recipients?: Recipient[];
            send_type: 'immediate' | 'scheduled' | 'draft';
            scheduled_at?: string;
            // Pre-uploaded to Hetzner via presigned URL — server fetches & base64-encodes
            attachment_urls?: Array<{ url: string; filename: string; type: string }>;
        };
        const subject           = body.subject;
        const email_body        = body.email_body;
        const audience_types    = body.audience_types;
        const custom_recipients = body.custom_recipients;
        const send_type         = body.send_type;
        const scheduled_at      = body.scheduled_at;

        if (body.attachment_urls?.length) {
            attachments = await Promise.all(
                body.attachment_urls.map(async ({ url, filename, type }) => {
                    const fileRes = await fetch(url);
                    if (!fileRes.ok) throw new Error(`Failed to fetch attachment: ${filename}`);
                    const buffer = Buffer.from(await fileRes.arrayBuffer());
                    return {
                        content:     buffer.toString('base64'),
                        filename,
                        type:        type || 'application/octet-stream',
                        disposition: 'attachment' as const,
                    };
                })
            );
        }

        if (!subject?.trim()) return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
        if (!email_body?.trim()) return NextResponse.json({ error: 'Email body is required' }, { status: 400 });

        const hasAudience = (audience_types?.length ?? 0) > 0;
        const hasCustom = (custom_recipients?.length ?? 0) > 0;
        if (!hasAudience && !hasCustom) {
            return NextResponse.json({ error: 'Select at least one audience or add custom recipients' }, { status: 400 });
        }
        if (send_type === 'scheduled' && !scheduled_at) {
            return NextResponse.json({ error: 'Scheduled time is required' }, { status: 400 });
        }

        const createdByName = auth.session.name || auth.session.email;
        const effectiveAudience = audience_types ?? [];
        const effectiveCustom = custom_recipients ?? [];

        // Derive a combined audience label for the record
        const audienceLabel: string[] = [
            ...effectiveAudience,
            ...(effectiveCustom.length > 0 ? ['custom'] : []),
        ];

        if (send_type === 'draft') {
            const res = await query(
                `INSERT INTO zecurx_admin.bulk_email_campaigns
                 (created_by, created_by_name, subject, body, audience_types, recipient_count, status)
                 VALUES ($1,$2,$3,$4,$5,$6,'draft') RETURNING *`,
                [auth.session.sub, createdByName, subject, email_body, audienceLabel, effectiveCustom.length]
            );
            return NextResponse.json({ campaign: res.rows[0] }, { status: 201 });
        }

        // Collect full recipient list (parallel queries)
        const recipients = await collectRecipients(effectiveAudience, effectiveCustom);

        if (recipients.length === 0) {
            return NextResponse.json({ error: 'No recipients found for the selected audience' }, { status: 400 });
        }

        if (send_type === 'scheduled') {
            const res = await query(
                `INSERT INTO zecurx_admin.bulk_email_campaigns
                 (created_by, created_by_name, subject, body, audience_types, recipient_count, status, scheduled_at)
                 VALUES ($1,$2,$3,$4,$5,$6,'scheduled',$7) RETURNING *`,
                [auth.session.sub, createdByName, subject, email_body, audienceLabel, recipients.length, scheduled_at]
            );
            return NextResponse.json({ campaign: res.rows[0] }, { status: 201 });
        }

        // Immediate send — create record as 'sending' first
        const campaignRes = await query(
            `INSERT INTO zecurx_admin.bulk_email_campaigns
             (created_by, created_by_name, subject, body, audience_types, recipient_count, status)
             VALUES ($1,$2,$3,$4,$5,$6,'sending') RETURNING id`,
            [auth.session.sub, createdByName, subject, email_body, audienceLabel, recipients.length]
        );
        const campaignId = campaignRes.rows[0].id;

        const sendError = await sendInBatches(recipients, subject, email_body, attachments);

        if (sendError) {
            await query(
                `UPDATE zecurx_admin.bulk_email_campaigns
                 SET status='failed', error_message=$1, updated_at=NOW() WHERE id=$2`,
                [sendError, campaignId]
            );
            return NextResponse.json({ error: `Send failed: ${sendError}` }, { status: 500 });
        }

        await query(
            `UPDATE zecurx_admin.bulk_email_campaigns
             SET status='sent', sent_at=NOW(), updated_at=NOW() WHERE id=$1`,
            [campaignId]
        );

        const finalRes = await query(
            `SELECT * FROM zecurx_admin.bulk_email_campaigns WHERE id=$1`,
            [campaignId]
        );

        return NextResponse.json({ campaign: finalRes.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('Error creating campaign:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
