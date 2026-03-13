import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { generateSlug } from '@/lib/blog-utils';
import { CreateCaseStudyRequest } from '@/types/auth';

export async function GET(req: NextRequest) {
  const authResult = await requirePermission('case_studies', 'read', req);
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
      conditions.push(`cs.status = $${paramIndex++}`);
      values.push(status);
    }

    if (search) {
      conditions.push(`(cs.title ILIKE $${paramIndex} OR cs.summary ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (category) {
      conditions.push(`cs.category = $${paramIndex++}`);
      values.push(category);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await db.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM case_studies cs ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    const caseStudiesResult = await db.query<{
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
        cs.*, a.name as author_name, a.email as author_email
      FROM case_studies cs
      LEFT JOIN admins a ON cs.author_id = a.id
      ${whereClause}
      ORDER BY cs.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, limit, offset]
    );

    return NextResponse.json({
      caseStudies: caseStudiesResult.rows,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Get case studies error:', error);
    return NextResponse.json({ error: 'Failed to fetch case studies' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requirePermission('case_studies', 'create', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { session } = authResult;

  try {
    const body: CreateCaseStudyRequest = await req.json();
    const { title, slug, summary, category, pages, cover_image_url, pdf_url, status } = body;

    if (!title || !summary || !pdf_url) {
      return NextResponse.json({ error: 'Title, summary, and PDF URL are required' }, { status: 400 });
    }

    const finalSlug = slug || generateSlug(title);

    const existingResult = await db.query<{ id: string }>(
      'SELECT id FROM case_studies WHERE slug = $1',
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
      `INSERT INTO case_studies (title, slug, summary, category, pages, cover_image_url, pdf_url, author_id, status, published_at)
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

    const newCaseStudy = insertResult.rows[0];

    return NextResponse.json({ caseStudy: newCaseStudy }, { status: 201 });
  } catch (error) {
    console.error('Create case study error:', error);
    return NextResponse.json({ error: 'Failed to create case study' }, { status: 500 });
  }
}
