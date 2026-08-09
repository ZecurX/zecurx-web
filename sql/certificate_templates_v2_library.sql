-- Evolves certificate templates from a single "active global template" into a
-- library: every upload is kept, one of them can be marked as the default
-- (used by seminars that haven't picked one), and each seminar can select a
-- specific template of its own.

ALTER TABLE seminar.certificate_templates RENAME COLUMN is_active TO is_default;
ALTER TABLE seminar.certificate_templates ADD COLUMN IF NOT EXISTS name VARCHAR(255);

ALTER TABLE seminar.seminars
    ADD COLUMN IF NOT EXISTS certificate_template_id UUID REFERENCES seminar.certificate_templates(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_seminars_certificate_template_id ON seminar.seminars(certificate_template_id);
