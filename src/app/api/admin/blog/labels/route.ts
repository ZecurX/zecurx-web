import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { generateSlug } from '@/lib/blog';
import { CreateBlogLabelRequest } from '@/types/auth';

export async function GET(req: NextRequest) {
  const authResult = await requirePermission('blog', 'read', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const result = await db.query<{
      id: string;
      name: string;
      slug: string;
      color: string;
      created_at: string;
      updated_at: string;
    }>(
      'SELECT * FROM blog_labels ORDER BY name ASC'
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Get labels error:', error);
    return NextResponse.json({ error: 'Failed to fetch labels' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requirePermission('blog', 'create', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const body: CreateBlogLabelRequest = await req.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'Label name is required' }, { status: 400 });
    }

    const slug = generateSlug(body.name);
    const color = body.color?.trim() || '#3B82F6';

    const existingResult = await db.query<{ id: string }>(
      'SELECT id FROM blog_labels WHERE slug = $1',
      [slug]
    );

    if (existingResult.rows.length > 0) {
      return NextResponse.json({ error: 'Label with this name already exists' }, { status: 409 });
    }

    const insertResult = await db.query<{
      id: string;
      name: string;
      slug: string;
      color: string;
      created_at: string;
      updated_at: string;
    }>(
      'INSERT INTO blog_labels (name, slug, color) VALUES ($1, $2, $3) RETURNING *',
      [body.name.trim(), slug, color]
    );

    return NextResponse.json(insertResult.rows[0], { status: 201 });
  } catch (error) {
    console.error('Create label error:', error);
    return NextResponse.json({ error: 'Failed to create label' }, { status: 500 });
  }
}
