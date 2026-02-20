import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requirePermission, getClientIP, getUserAgent } from '@/lib/auth';
import { logBlogCreate } from '@/lib/audit';
import { generateSlug } from '@/lib/blog';
import { CreateBlogPostRequest } from '@/types/auth';

export async function GET(req: NextRequest) {
  const authResult = await requirePermission('blog', 'read', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const labelId = searchParams.get('label_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`bp.status = $${paramIndex++}`);
      values.push(status);
    }

    if (search) {
      conditions.push(`(bp.title ILIKE $${paramIndex} OR bp.content ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
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
      `SELECT 
        bp.*, a.name as author_name, a.email as author_email
      FROM blog_posts bp
      LEFT JOIN admins a ON bp.author_id = a.id
      ${whereClause}
      ORDER BY bp.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, limit, offset]
    );

    const postIds = postsResult.rows.map(p => p.id);
    const labelsMap: Record<string, Array<{ id: string; name: string; slug: string; color: string }>> = {};

    if (postIds.length > 0) {
      const placeholders = postIds.map((_, i) => `$${i + 1}`).join(', ');
      const labelsResult = await db.query<{
        blog_post_id: string;
        id: string;
        name: string;
        slug: string;
        color: string;
      }>(
        `SELECT bpl.blog_post_id, bl.id, bl.name, bl.slug, bl.color
        FROM blog_post_labels bpl
        JOIN blog_labels bl ON bpl.label_id = bl.id
        WHERE bpl.blog_post_id IN (${placeholders})`,
        postIds
      );

      labelsResult.rows.forEach(row => {
        if (!labelsMap[row.blog_post_id]) {
          labelsMap[row.blog_post_id] = [];
        }
        labelsMap[row.blog_post_id].push({
          id: row.id,
          name: row.name,
          slug: row.slug,
          color: row.color
        });
      });
    }

    let posts = postsResult.rows.map(post => ({
      ...post,
      labels: labelsMap[post.id] || []
    }));

    if (labelId) {
      posts = posts.filter(post => 
        post.labels.some(label => label.id === labelId)
      );
    }

    return NextResponse.json({
      posts,
      total: labelId ? posts.length : total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requirePermission('blog', 'create', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { session } = authResult;

  try {
    const body: CreateBlogPostRequest = await req.json();
    const { title, slug, content, excerpt, featured_image_url, status, meta_description, label_ids } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const finalSlug = slug || generateSlug(title);

    const existingResult = await db.query<{ id: string }>(
      'SELECT id FROM blog_posts WHERE slug = $1',
      [finalSlug]
    );

    if (existingResult.rows.length > 0) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const insertResult = await db.query<{
      id: string;
      title: string;
      slug: string;
      content: string;
      excerpt: string | null;
      featured_image_url: string | null;
      author_id: string;
      status: string;
      published_at: string | null;
      meta_description: string | null;
      created_at: string;
      updated_at: string;
    }>(
      `INSERT INTO blog_posts (title, slug, content, excerpt, featured_image_url, author_id, status, published_at, meta_description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        title,
        finalSlug,
        content,
        excerpt || null,
        featured_image_url || null,
        session.sub,
        status || 'draft',
        status === 'published' ? new Date().toISOString() : null,
        meta_description || null
      ]
    );

    const newPost = insertResult.rows[0];

    if (label_ids && label_ids.length > 0) {
      const labelValues = label_ids.map((labelId, i) => 
        `($1, $${i + 2})`
      ).join(', ');
      
      await db.query(
        `INSERT INTO blog_post_labels (blog_post_id, label_id) VALUES ${labelValues}`,
        [newPost.id, ...label_ids]
      );
    }

    const ipAddress = getClientIP(req);
    const userAgent = getUserAgent(req);
    await logBlogCreate(
      { id: session.sub, email: session.email, role: session.role },
      newPost.id,
      title,
      ipAddress,
      userAgent
    );

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error('Create blog post error:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
