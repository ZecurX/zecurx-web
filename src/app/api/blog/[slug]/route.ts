import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const postResult = await db.query<{
      id: string;
      title: string;
      slug: string;
      content: string;
      excerpt: string | null;
      featured_image_url: string | null;
      meta_description: string | null;
      published_at: string | null;
      view_count: number;
      author_id: string;
      author_name: string | null;
      author_email: string;
    }>(
      `SELECT 
        bp.id, bp.title, bp.slug, bp.content, bp.excerpt, 
        bp.featured_image_url, bp.meta_description, bp.published_at, 
        bp.view_count, bp.author_id,
        a.name as author_name, a.email as author_email
      FROM blog_posts bp
      LEFT JOIN admins a ON bp.author_id = a.id
      WHERE bp.slug = $1 AND bp.status = 'published'`,
      [slug]
    );

    if (postResult.rows.length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const post = postResult.rows[0];

    await db.query(
      'UPDATE blog_posts SET view_count = view_count + 1 WHERE id = $1',
      [post.id]
    );

    const labelsResult = await db.query<{
      id: string;
      name: string;
      slug: string;
      color: string;
    }>(
      `SELECT bl.id, bl.name, bl.slug, bl.color
      FROM blog_post_labels bpl
      JOIN blog_labels bl ON bpl.label_id = bl.id
      WHERE bpl.blog_post_id = $1`,
      [post.id]
    );

    const labels = labelsResult.rows;

    let relatedPosts: Array<{
      id: string;
      title: string;
      slug: string;
      excerpt: string | null;
      featured_image_url: string | null;
      published_at: string | null;
      view_count: number;
      author: { id: string; email: string; name: string | null } | null;
      labels: Array<{ id: string; name: string; slug: string; color: string }>;
    }> = [];

    if (labels.length > 0) {
      const labelIds = labels.map(l => l.id);
      const placeholders = labelIds.map((_, i) => `$${i + 1}`).join(', ');
      
      const relatedIdsResult = await db.query<{ blog_post_id: string }>(
        `SELECT DISTINCT blog_post_id 
        FROM blog_post_labels 
        WHERE label_id IN (${placeholders}) AND blog_post_id != $${labelIds.length + 1}`,
        [...labelIds, post.id]
      );

      if (relatedIdsResult.rows.length > 0) {
        const relatedIds = relatedIdsResult.rows.map(r => r.blog_post_id);
        const relatedPlaceholders = relatedIds.map((_, i) => `$${i + 1}`).join(', ');

        const relatedResult = await db.query<{
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
          WHERE bp.id IN (${relatedPlaceholders}) AND bp.status = 'published'
          ORDER BY bp.published_at DESC
          LIMIT 3`,
          relatedIds
        );

        const relatedLabelsResult = await db.query<{
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
          WHERE bpl.blog_post_id IN (${relatedPlaceholders})`,
          relatedIds
        );

        const relatedLabelsMap: Record<string, Array<{ id: string; name: string; slug: string; color: string }>> = {};
        relatedLabelsResult.rows.forEach(row => {
          if (!relatedLabelsMap[row.blog_post_id]) {
            relatedLabelsMap[row.blog_post_id] = [];
          }
          relatedLabelsMap[row.blog_post_id].push({
            id: row.label_id,
            name: row.label_name,
            slug: row.label_slug,
            color: row.label_color
          });
        });

        relatedPosts = relatedResult.rows.map(rp => ({
          id: rp.id,
          title: rp.title,
          slug: rp.slug,
          excerpt: rp.excerpt,
          featured_image_url: rp.featured_image_url,
          published_at: rp.published_at,
          view_count: rp.view_count,
          author: rp.author_id ? {
            id: rp.author_id,
            email: rp.author_email,
            name: rp.author_name
          } : null,
          labels: relatedLabelsMap[rp.id] || []
        }));
      }
    }

    const response = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      featured_image_url: post.featured_image_url,
      meta_description: post.meta_description,
      published_at: post.published_at,
      view_count: post.view_count + 1,
      author: post.author_id ? {
        id: post.author_id,
        email: post.author_email,
        name: post.author_name
      } : null,
      labels,
      related_posts: relatedPosts
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
