import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { UpdateBlogLabelRequest } from '@/types/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requirePermission('blog', 'update', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { id } = await params;

  try {
    const body: UpdateBlogLabelRequest = await req.json();

    const updates: string[] = ['updated_at = NOW()'];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (body.name) {
      updates.push(`name = $${paramIndex++}`);
      values.push(body.name.trim());
    }
    if (body.color) {
      updates.push(`color = $${paramIndex++}`);
      values.push(body.color.trim());
    }

    if (values.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);

    const result = await db.query<{
      id: string;
      name: string;
      slug: string;
      color: string;
      created_at: string;
      updated_at: string;
    }>(
      `UPDATE blog_labels SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Label not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Update label error:', error);
    return NextResponse.json({ error: 'Failed to update label' }, { status: 500 });
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

  const { id } = await params;

  try {
    const countResult = await db.query<{ count: string }>(
      'SELECT COUNT(*) as count FROM blog_post_labels WHERE label_id = $1',
      [id]
    );

    const count = parseInt(countResult.rows[0].count);
    if (count > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete label in use by posts' 
      }, { status: 400 });
    }

    await db.query('DELETE FROM blog_labels WHERE id = $1', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete label error:', error);
    return NextResponse.json({ error: 'Failed to delete label' }, { status: 500 });
  }
}
