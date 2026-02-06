-- Blog Editor Features Migration
-- Run this SQL in your PostgreSQL database

-- =====================================================
-- 1. Version History Table
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_post_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image_url TEXT,
    meta_description TEXT,
    created_by UUID REFERENCES admins(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_post_versions_post ON blog_post_versions(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_versions_created ON blog_post_versions(created_at DESC);

-- =====================================================
-- 2. Content Templates Table
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    thumbnail_url TEXT,
    created_by UUID REFERENCES admins(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_templates_category ON blog_templates(category);

-- =====================================================
-- 3. Related Posts Junction Table
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_post_related (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    related_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(blog_post_id, related_post_id)
);

CREATE INDEX IF NOT EXISTS idx_blog_post_related_post ON blog_post_related(blog_post_id);

-- =====================================================
-- 4. Add new columns to blog_posts table
-- =====================================================
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS reading_time_minutes INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS og_title TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS og_description TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS og_image_url TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS twitter_title TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS twitter_description TEXT;

-- Create index for scheduled posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled ON blog_posts(scheduled_publish_at) WHERE scheduled_publish_at IS NOT NULL;

-- =====================================================
-- 5. Insert default templates
-- =====================================================
INSERT INTO blog_templates (name, description, content, category) VALUES
(
    'Tutorial Post',
    'Step-by-step tutorial template with clear sections',
    '<h1>Tutorial Title</h1>
<p>Brief introduction explaining what readers will learn.</p>

<h2>Prerequisites</h2>
<ul>
<li>Requirement 1</li>
<li>Requirement 2</li>
</ul>

<h2>Step 1: Getting Started</h2>
<p>Explain the first step in detail...</p>

<h2>Step 2: Implementation</h2>
<p>Continue with the next steps...</p>

<h2>Step 3: Testing</h2>
<p>How to verify everything works...</p>

<h2>Conclusion</h2>
<p>Summary of what was accomplished and next steps.</p>',
    'tutorial'
),
(
    'News Announcement',
    'Template for news and announcements',
    '<h1>Announcement Title</h1>
<p><strong>Date:</strong> [Insert Date]</p>

<p>Lead paragraph summarizing the key news...</p>

<h2>Key Highlights</h2>
<ul>
<li>Highlight 1</li>
<li>Highlight 2</li>
<li>Highlight 3</li>
</ul>

<h2>Details</h2>
<p>Expand on the announcement with more details...</p>

<h2>What This Means For You</h2>
<p>Explain the impact on readers...</p>

<h2>Next Steps</h2>
<p>Call to action or what happens next...</p>',
    'news'
),
(
    'Product Feature',
    'Template for showcasing product features',
    '<h1>Introducing [Feature Name]</h1>
<p>Brief exciting intro about the new feature...</p>

<h2>The Problem</h2>
<p>What challenge does this solve?</p>

<h2>The Solution</h2>
<p>How our feature addresses this...</p>

<h2>How It Works</h2>
<p>Step-by-step explanation with screenshots...</p>

<h2>Benefits</h2>
<ul>
<li>Benefit 1</li>
<li>Benefit 2</li>
<li>Benefit 3</li>
</ul>

<h2>Get Started</h2>
<p>How to start using this feature today...</p>',
    'product'
),
(
    'Case Study',
    'Template for customer success stories',
    '<h1>[Customer Name] Success Story</h1>

<h2>About the Customer</h2>
<p>Brief background about the customer...</p>

<h2>The Challenge</h2>
<p>What problems were they facing?</p>

<h2>The Solution</h2>
<p>How our product/service helped...</p>

<h2>Results</h2>
<ul>
<li>Key metric improvement 1</li>
<li>Key metric improvement 2</li>
<li>Key metric improvement 3</li>
</ul>

<blockquote>
<p>"Customer testimonial quote here..."</p>
<p>— Customer Name, Title</p>
</blockquote>

<h2>Key Takeaways</h2>
<p>What others can learn from this success...</p>',
    'case-study'
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 6. Create updated_at trigger for templates
-- =====================================================
CREATE OR REPLACE FUNCTION update_blog_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_blog_templates_updated_at ON blog_templates;
CREATE TRIGGER trigger_update_blog_templates_updated_at
    BEFORE UPDATE ON blog_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_templates_updated_at();

-- =====================================================
-- Done! All blog editor feature tables are ready.
-- =====================================================
