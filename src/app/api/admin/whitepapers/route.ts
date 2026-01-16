import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requirePermission, getClientIP, getUserAgent } from '@/lib/auth';
import { generateSlug } from '@/lib/blog-utils';
import { CreateWhitepaperRequest } from '@/types/auth';

export async function GET(req: NextRequest) {
  const authResult = await requirePermission('whitepapers', 'read', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`w.status = $${paramIndex++}`);
      values.push(status);
    }

    if (search) {
      conditions.push(`(w.title ILIKE $${paramIndex} OR w.summary ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (category) {
      conditions.push(`w.category = $${paramIndex++}`);
      values.push(category);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await db.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM whitepapers w ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    const whitepapersResult = await db.query<{
      id: string;
      title: string;
      slug: string;
      summary: string;
      category: string;
      pages: number;
      cover_image_url: string | null;
      pdf_url: string;
      status: string;
      published_at: string | null;
      download_count: number;
      created_at: string;
      updated_at: string;
      author_id: string;
      author_name: string | null;
      author_email: string;
    }>(
      `SELECT 
        w.*, a.name as author_name, a.email as author_email
      FROM whitepapers w
      LEFT JOIN admins a ON w.author_id = a.id
      ${whereClause}
      ORDER BY w.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, limit, offset]
    );

    return NextResponse.json({
      whitepapers: whitepapersResult.rows,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Get whitepapers error:', error);
    return NextResponse.json({ error: 'Failed to fetch whitepapers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requirePermission('whitepapers', 'create', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { session } = authResult;

  try {
    const body: CreateWhitepaperRequest = await req.json();
    const { title, slug, summary, category, pages, cover_image_url, pdf_url, status } = body;

    if (!title || !summary || !pdf_url) {
      return NextResponse.json({ error: 'Title, summary, and PDF URL are required' }, { status: 400 });
    }

    const finalSlug = slug || generateSlug(title);

    const existingResult = await db.query<{ id: string }>(
      'SELECT id FROM whitepapers WHERE slug = $1',
      [finalSlug]
    );

    if (existingResult.rows.length > 0) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const insertResult = await db.query<{
      id: string;
      title: string;
      slug: string;
      summary: string;
      category: string;
      pages: number;
      cover_image_url: string | null;
      pdf_url: string;
      author_id: string;
      status: string;
      published_at: string | null;
      download_count: number;
      created_at: string;
      updated_at: string;
    }>(
      `INSERT INTO whitepapers (title, slug, summary, category, pages, cover_image_url, pdf_url, author_id, status, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        title,
        finalSlug,
        summary,
        category || 'General',
        pages || 0,
        cover_image_url || null,
        pdf_url,
        session.sub,
        status || 'draft',
        status === 'published' ? new Date().toISOString() : null,
      ]
    );

    const newWhitepaper = insertResult.rows[0];

    return NextResponse.json({ whitepaper: newWhitepaper }, { status: 201 });
  } catch (error) {
    console.error('Create whitepaper error:', error);
    return NextResponse.json({ error: 'Failed to create whitepaper' }, { status: 500 });
  }
}
