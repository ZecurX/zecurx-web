import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search')?.trim() || '';
    const labelSlug = searchParams.get('label')?.trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '9')));
    const offset = (page - 1) * limit;

    let postIds: string[] | null = null;

    if (labelSlug) {
      const labelResult = await db.query<{ id: string }>(
        'SELECT id FROM blog_labels WHERE slug = $1',
        [labelSlug]
      );
      
      if (labelResult.rows.length === 0) {
        return NextResponse.json({
          posts: [],
          pagination: { page, limit, total: 0, total_pages: 0 }
        });
      }

      const postLabelsResult = await db.query<{ blog_post_id: string }>(
        'SELECT blog_post_id FROM blog_post_labels WHERE label_id = $1',
        [labelResult.rows[0].id]
      );
      
      if (postLabelsResult.rows.length === 0) {
        return NextResponse.json({
          posts: [],
          pagination: { page, limit, total: 0, total_pages: 0 }
        });
      }
      
      postIds = postLabelsResult.rows.map(r => r.blog_post_id);
    }

    const conditions: string[] = ["bp.status = 'published'"];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(`(bp.title ILIKE $${paramIndex} OR bp.content ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (postIds && postIds.length > 0) {
      const placeholders = postIds.map((_, i) => `$${paramIndex + i}`).join(', ');
      conditions.push(`bp.id IN (${placeholders})`);
      values.push(...postIds);
      paramIndex += postIds.length;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await db.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM blog_posts bp ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    const postsResult = await db.query<{
      id: string;
      title: string;
      slug: string;
      excerpt: string | null;
      featured_image_url: string | null;
      published_at: string | null;
      view_count: number;
      author_id: string;
      author_name: string | null;
      author_email: string;
    }>(
      `SELECT 
        bp.id, bp.title, bp.slug, bp.excerpt, bp.featured_image_url, 
        bp.published_at, bp.view_count, bp.author_id,
        a.name as author_name, a.email as author_email
      FROM blog_posts bp
      LEFT JOIN admins a ON bp.author_id = a.id
      ${whereClause}
      ORDER BY bp.published_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, limit, offset]
    );

    const postIdsForLabels = postsResult.rows.map(p => p.id);
    const labelsMap: Record<string, { id: string; name: string; slug: string; color: string }[]> = {};

    if (postIdsForLabels.length > 0) {
      const labelsPlaceholders = postIdsForLabels.map((_, i) => `$${i + 1}`).join(', ');
      const labelsResult = await db.query<{
        blog_post_id: string;
        label_id: string;
        label_name: string;
        label_slug: string;
        label_color: string;
      }>(
        `SELECT 
          bpl.blog_post_id, bl.id as label_id, bl.name as label_name, 
          bl.slug as label_slug, bl.color as label_color
        FROM blog_post_labels bpl
        JOIN blog_labels bl ON bpl.label_id = bl.id
        WHERE bpl.blog_post_id IN (${labelsPlaceholders})`,
        postIdsForLabels
      );

      labelsResult.rows.forEach(row => {
        if (!labelsMap[row.blog_post_id]) {
          labelsMap[row.blog_post_id] = [];
        }
        labelsMap[row.blog_post_id].push({
          id: row.label_id,
          name: row.label_name,
          slug: row.label_slug,
          color: row.label_color
        });
      });
    }

    const transformedPosts = postsResult.rows.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      featured_image_url: post.featured_image_url,
      published_at: post.published_at,
      view_count: post.view_count,
      author: post.author_id ? {
        id: post.author_id,
        email: post.author_email,
        name: post.author_name
      } : null,
      labels: labelsMap[post.id] || []
    }));

    return NextResponse.json({
      posts: transformedPosts,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching public blog posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
