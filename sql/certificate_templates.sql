-- Global certificate template (seminar schema)
-- Only one row is ever active at a time; uploading a new template deactivates the previous one.
-- The active template is used for certificate generation across ALL seminars, not just the one it was uploaded from.

CREATE TABLE IF NOT EXISTS seminar.certificate_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    image_key VARCHAR(500) NOT NULL,
    image_url TEXT NOT NULL,
    pdf_key VARCHAR(500) NOT NULL,
    pdf_url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    uploaded_by_id VARCHAR(255),
    uploaded_by_email VARCHAR(255),
    uploaded_from_seminar_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certificate_templates_is_active ON seminar.certificate_templates(is_active);
