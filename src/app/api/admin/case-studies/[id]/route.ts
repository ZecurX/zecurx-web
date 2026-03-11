import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { UpdateCaseStudyRequest } from '@/types/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requirePermission('case_studies', 'read', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { id } = await params;

  try {
    const result = await db.query<{
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
      `SELECT cs.*, a.name as author_name, a.email as author_email
       FROM case_studies cs
       LEFT JOIN admins a ON cs.author_id = a.id
       WHERE cs.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    return NextResponse.json({ caseStudy: result.rows[0] });
  } catch (error) {
    console.error('Get case study error:', error);
    return NextResponse.json({ error: 'Failed to fetch case study' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requirePermission('case_studies', 'update', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { id } = await params;

  try {
    const body: UpdateCaseStudyRequest = await req.json();
    const { title, summary, category, pages, cover_image_url, pdf_url, status } = body;

    const existingResult = await db.query<{ id: string }>(
      'SELECT id FROM case_studies WHERE id = $1',
      [id]
    );

    if (existingResult.rows.length === 0) {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(title);
    }
    if (summary !== undefined) {
      updates.push(`summary = $${paramIndex++}`);
      values.push(summary);
    }
    if (category !== undefined) {
      updates.push(`category = $${paramIndex++}`);
      values.push(category);
    }
    if (pages !== undefined) {
      updates.push(`pages = $${paramIndex++}`);
      values.push(pages);
    }
    if (cover_image_url !== undefined) {
      updates.push(`cover_image_url = $${paramIndex++}`);
      values.push(cover_image_url);
    }
    if (pdf_url !== undefined) {
      updates.push(`pdf_url = $${paramIndex++}`);
      values.push(pdf_url);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
      if (status === 'published') {
        updates.push(`published_at = COALESCE(published_at, NOW())`);
      }
    }

    updates.push(`updated_at = NOW()`);

    if (updates.length === 1) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);

    const updateResult = await db.query<{
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
    }>(
      `UPDATE case_studies SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return NextResponse.json({ caseStudy: updateResult.rows[0] });
  } catch (error) {
    console.error('Update case study error:', error);
    return NextResponse.json({ error: 'Failed to update case study' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requirePermission('case_studies', 'delete', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { id } = await params;

  try {
    const existingResult = await db.query<{ id: string; title: string }>(
      'SELECT id, title FROM case_studies WHERE id = $1',
      [id]
    );

    if (existingResult.rows.length === 0) {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    await db.query('DELETE FROM case_studies WHERE id = $1', [id]);

    return NextResponse.json({ 
      success: true, 
      message: 'Case study deleted successfully' 
    });
  } catch (error) {
    console.error('Delete case study error:', error);
    return NextResponse.json({ error: 'Failed to delete case study' }, { status: 500 });
  }
}
