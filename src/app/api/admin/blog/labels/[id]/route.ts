import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requirePermission } from '@/lib/auth';
import { UpdateBlogLabelRequest } from '@/types/auth';

// PUT - Update label (marketing only)
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

    const updateData: any = {};
    if (body.name) updateData.name = body.name.trim();
    if (body.color) updateData.color = body.color.trim();

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const { data: label, error } = await supabase
      .from('blog_labels')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Label not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(label);
  } catch (error: any) {
    console.error('Update label error:', error);
    return NextResponse.json({ error: 'Failed to update label' }, { status: 500 });
  }
}

// DELETE - Delete label (marketing only)
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
    // Check if label is used
    const { count } = await supabase
      .from('blog_post_labels')
      .select('*', { count: 'exact', head: true })
      .eq('label_id', id);

    if (count && count > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete label in use by posts' 
      }, { status: 400 });
    }

    const { error } = await supabase
      .from('blog_labels')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete label error:', error);
    return NextResponse.json({ error: 'Failed to delete label' }, { status: 500 });
  }
}
