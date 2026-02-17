import { query } from '@/lib/db';
import { BlogPageClient } from './BlogPageClient';

export const metadata = {
  title: 'Security Intelligence Hub',
  description: 'Expert analysis, threat intelligence, and industry insights from the ZecurX security team.',
  openGraph: {
    title: 'Security Intelligence Hub | ZecurX Blog',
    description: 'Expert analysis, threat intelligence, and industry insights from the ZecurX security team.',
    type: 'website' as const,
    url: 'https://zecurx.com/blog',
  },
  alternates: {
    canonical: 'https://zecurx.com/blog',
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; label?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const limit = 9;
  const offset = (page - 1) * limit;
  const search = resolvedParams.search || '';
  const labelSlug = resolvedParams.label || '';

  let countQuery = `SELECT COUNT(*) as total FROM blog_posts WHERE status = 'published'`;
  let postsQuery = `
    SELECT bp.*, 
           a.name as author_name, a.email as author_email
    FROM blog_posts bp
    LEFT JOIN admins a ON bp.author_id = a.id
    WHERE bp.status = 'published'
  `;
  const params: any[] = [];
  let paramIndex = 1;

  if (search) {
    const searchCondition = ` AND (bp.title ILIKE $${paramIndex} OR bp.content ILIKE $${paramIndex})`;
    postsQuery += searchCondition;
    countQuery += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (labelSlug) {
    const labelResult = await query('SELECT id FROM blog_labels WHERE slug = $1 LIMIT 1', [labelSlug]);
    if (labelResult.rows.length > 0) {
      const labelId = labelResult.rows[0].id;
      const labelCondition = ` AND bp.id IN (SELECT blog_post_id FROM blog_post_labels WHERE label_id = $${paramIndex})`;
      postsQuery += labelCondition;
      countQuery += ` AND id IN (SELECT blog_post_id FROM blog_post_labels WHERE label_id = $${paramIndex})`;
      params.push(labelId);
      paramIndex++;
    } else {
      return <BlogPageClient error="label_not_found" />;
    }
  }

  postsQuery += ` ORDER BY bp.published_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  const countParams = params.slice();
  params.push(limit, offset);

  try {
    const [countResult, postsResult, labelsResult] = await Promise.all([
      query(countQuery, countParams),
      query(postsQuery, params),
      query('SELECT * FROM blog_labels ORDER BY name')
    ]);

    const count = parseInt(countResult.rows[0]?.total || '0');
    const posts = postsResult.rows;
    const allLabels = labelsResult.rows;
    const totalPages = Math.ceil(count / limit);

    if (posts.length > 0) {
      const postIds = posts.map(p => p.id);
      const placeholders = postIds.map((_, i) => `$${i + 1}`).join(',');

      const labelsRes = await query(`
        SELECT bpl.blog_post_id, bl.*
        FROM blog_post_labels bpl
        JOIN blog_labels bl ON bpl.label_id = bl.id
        WHERE bpl.blog_post_id IN (${placeholders})
      `, postIds);

      const labelsMap: Record<string, any[]> = {};
      labelsRes.rows.forEach((row: any) => {
        if (!labelsMap[row.blog_post_id]) {
          labelsMap[row.blog_post_id] = [];
        }
        labelsMap[row.blog_post_id].push({ blog_labels: row });
      });

      posts.forEach((post: any) => {
        post.labels = labelsMap[post.id] || [];
        post.author = { name: post.author_name, email: post.author_email };
      });
    }

    return (
      <BlogPageClient
        posts={posts}
        allLabels={allLabels}
        page={page}
        totalPages={totalPages}
        search={search}
        labelSlug={labelSlug}
      />
    );
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return <BlogPageClient error="fetch_failed" />;
  }
}
