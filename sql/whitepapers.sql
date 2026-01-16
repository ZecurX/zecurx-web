-- Whitepapers Table for ZecurX Admin
-- Run this SQL in your PostgreSQL database to create the whitepapers table

-- Make sure we're using the right schema
SET search_path TO zecurx_admin, public;

-- Create the whitepapers table
CREATE TABLE IF NOT EXISTS whitepapers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    pages INTEGER DEFAULT 0,
    cover_image_url TEXT,
    pdf_url TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES admins(id),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMP WITH TIME ZONE,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_whitepapers_status ON whitepapers(status);
CREATE INDEX IF NOT EXISTS idx_whitepapers_category ON whitepapers(category);
CREATE INDEX IF NOT EXISTS idx_whitepapers_slug ON whitepapers(slug);
CREATE INDEX IF NOT EXISTS idx_whitepapers_published_at ON whitepapers(published_at DESC);

-- Create a trigger to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_whitepapers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_whitepapers_updated_at ON whitepapers;
CREATE TRIGGER trigger_whitepapers_updated_at
    BEFORE UPDATE ON whitepapers
    FOR EACH ROW
    EXECUTE FUNCTION update_whitepapers_updated_at();

-- Grant permissions (adjust as needed)
-- GRANT ALL ON whitepapers TO your_app_user;

-- Sample data (optional - uncomment to insert)
/*
INSERT INTO whitepapers (title, slug, summary, category, pages, pdf_url, author_id, status, published_at) VALUES
(
    'The Complete Guide to Zero Trust Architecture',
    'complete-guide-zero-trust-architecture',
    'A comprehensive framework for implementing zero trust security principles across your organization''s infrastructure. This whitepaper covers the fundamental concepts, implementation strategies, and best practices for adopting a zero trust security model.',
    'Zero Trust Security',
    48,
    'https://example.com/whitepapers/zero-trust-guide.pdf',
    (SELECT id FROM admins WHERE role = 'super_admin' LIMIT 1),
    'published',
    NOW()
),
(
    'Cloud Security Posture Management Best Practices',
    'cloud-security-posture-management-best-practices',
    'Strategic insights into securing multi-cloud environments and maintaining continuous compliance. Learn how to implement effective CSPM strategies across AWS, Azure, and GCP.',
    'Cloud Compliance',
    32,
    'https://example.com/whitepapers/cspm-best-practices.pdf',
    (SELECT id FROM admins WHERE role = 'super_admin' LIMIT 1),
    'published',
    NOW()
);
*/

-- Verify table creation
SELECT 'Whitepapers table created successfully!' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'whitepapers' 
ORDER BY ordinal_position;
