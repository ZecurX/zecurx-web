import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requirePermission, getClientIP, getUserAgent } from '@/lib/auth';
import { logBlogUpdate, logBlogDelete } from '@/lib/audit';
import { UpdateBlogPostRequest } from '@/types/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requirePermission('blog', 'read', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { id } = await params;

  try {
    const postResult = await db.query<{
      id: string;
      title: string;
      slug: string;
      content: string;
      excerpt: string | null;
      featured_image_url: string | null;
      status: string;
      published_at: string | null;
      meta_description: string | null;
      view_count: number;
      created_at: string;
      updated_at: string;
      author_id: string;
      author_name: string | null;
      author_email: string;
    }>(
      `SELECT bp.*, a.name as author_name, a.email as author_email
      FROM blog_posts bp
      LEFT JOIN admins a ON bp.author_id = a.id
      WHERE bp.id = $1`,
      [id]
    );

    if (postResult.rows.length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const post = postResult.rows[0];

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
      [id]
    );

    return NextResponse.json({
      ...post,
      labels: labelsResult.rows
    });
  } catch (error) {
    console.error('Get blog post error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requirePermission('blog', 'update', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { session } = authResult;
  const { id } = await params;

  try {
    const body: UpdateBlogPostRequest = await req.json();

    const existingResult = await db.query<{
      id: string;
      title: string;
      published_at: string | null;
    }>(
      'SELECT id, title, published_at FROM blog_posts WHERE id = $1',
      [id]
    );

    if (existingResult.rows.length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const existingPost = existingResult.rows[0];

    const updates: string[] = ['updated_at = NOW()'];
    const values: unknown[] = [];
    let paramIndex = 1;
    const fieldsUpdated: string[] = [];

    if (body.title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(body.title);
      fieldsUpdated.push('title');
    }
    if (body.content !== undefined) {
      updates.push(`content = $${paramIndex++}`);
      values.push(body.content);
      fieldsUpdated.push('content');
    }
    if (body.excerpt !== undefined) {
      updates.push(`excerpt = $${paramIndex++}`);
      values.push(body.excerpt || null);
      fieldsUpdated.push('excerpt');
    }
    if (body.featured_image_url !== undefined) {
      updates.push(`featured_image_url = $${paramIndex++}`);
      values.push(body.featured_image_url || null);
      fieldsUpdated.push('featured_image_url');
    }
    if (body.meta_description !== undefined) {
      updates.push(`meta_description = $${paramIndex++}`);
      values.push(body.meta_description || null);
      fieldsUpdated.push('meta_description');
    }
    if (body.status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(body.status);
      fieldsUpdated.push('status');
      
      if (body.status === 'published' && !existingPost.published_at) {
        updates.push(`published_at = NOW()`);
      } else if (body.status === 'draft') {
        updates.push(`published_at = NULL`);
      }
    }

    values.push(id);

    const updateResult = await db.query<{
      id: string;
      title: string;
      slug: string;
      content: string;
      excerpt: string | null;
      featured_image_url: string | null;
      status: string;
      published_at: string | null;
      meta_description: string | null;
      created_at: string;
      updated_at: string;
    }>(
      `UPDATE blog_posts SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    const updatedPost = updateResult.rows[0];

    if (body.label_ids !== undefined) {
      await db.query('DELETE FROM blog_post_labels WHERE blog_post_id = $1', [id]);
      
      if (body.label_ids.length > 0) {
        const labelValues = body.label_ids.map((_, i) => `($1, $${i + 2})`).join(', ');
        await db.query(
          `INSERT INTO blog_post_labels (blog_post_id, label_id) VALUES ${labelValues}`,
          [id, ...body.label_ids]
        );
      }
    }

    const ipAddress = getClientIP(req);
    const userAgent = getUserAgent(req);
    await logBlogUpdate(
      { id: session.sub, email: session.email, role: session.role },
      id,
      existingPost.title,
      { fields_updated: fieldsUpdated },
      ipAddress,
      userAgent
    );

    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error('Update blog post error:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requirePermission('blog', 'delete', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { session } = authResult;
  const { id } = await params;

  try {
    const postResult = await db.query<{ id: string; title: string }>(
      'SELECT id, title FROM blog_posts WHERE id = $1',
      [id]
    );

    if (postResult.rows.length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const post = postResult.rows[0];

    await db.query('DELETE FROM blog_post_labels WHERE blog_post_id = $1', [id]);
    await db.query('DELETE FROM blog_posts WHERE id = $1', [id]);

    const ipAddress = getClientIP(req);
    const userAgent = getUserAgent(req);
    await logBlogDelete(
      { id: session.sub, email: session.email, role: session.role },
      id,
      post.title,
      ipAddress,
      userAgent
    );

    return NextResponse.json({ success: true, message: 'Blog post deleted' });
  } catch (error) {
    console.error('Delete blog post error:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
