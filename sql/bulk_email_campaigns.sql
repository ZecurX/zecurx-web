-- Bulk Email Campaigns table
-- Tracks all bulk email campaigns sent from the admin panel

CREATE TABLE IF NOT EXISTS zecurx_admin.bulk_email_campaigns (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by      UUID NOT NULL,
    created_by_name TEXT NOT NULL,
    subject         TEXT NOT NULL,
    body            TEXT NOT NULL,
    audience_types  TEXT[] NOT NULL,  -- ['student_leads','enrolled_students','enterprise_leads']
    recipient_count INTEGER NOT NULL DEFAULT 0,
    status          TEXT NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','scheduled','sending','sent','failed')),
    scheduled_at    TIMESTAMPTZ,
    sent_at         TIMESTAMPTZ,
    error_message   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bulk_email_campaigns_status
    ON zecurx_admin.bulk_email_campaigns(status);

CREATE INDEX IF NOT EXISTS idx_bulk_email_campaigns_created_at
    ON zecurx_admin.bulk_email_campaigns(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bulk_email_campaigns_created_by
    ON zecurx_admin.bulk_email_campaigns(created_by);
