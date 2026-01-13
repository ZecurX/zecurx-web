import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requirePermission, getClientIP, getUserAgent } from '@/lib/auth';
import { logBlogUpdate, logBlogDelete } from '@/lib/audit';
import { UpdateBlogPostRequest } from '@/types/auth';

// GET - Get single blog post
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
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        admins!blog_posts_author_id_fkey(name, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      throw error;
    }

    // Fetch labels
    const { data: labelData } = await supabase
      .from('blog_post_labels')
      .select('blog_labels(*)')
      .eq('blog_post_id', post.id);

    const response = {
      ...post,
      author_name: (post.admins as any)?.name,
      author_email: (post.admins as any)?.email,
      labels: labelData?.map((item: any) => item.blog_labels) || [],
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Get blog post error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// PUT - Update blog post (marketing only)
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

    // Fetch existing post
    const { data: existingPost, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      throw fetchError;
    }

    // Build update object (slug cannot be changed)
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt || null;
    if (body.featured_image_url !== undefined) updateData.featured_image_url = body.featured_image_url || null;
    if (body.meta_description !== undefined) updateData.meta_description = body.meta_description || null;
    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === 'published' && !existingPost.published_at) {
        updateData.published_at = new Date().toISOString();
      } else if (body.status === 'draft') {
        updateData.published_at = null;
      }
    }

    // Update blog post
    const { data: updatedPost, error: updateError } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Update labels if provided
    if (body.label_ids !== undefined) {
      await supabase.from('blog_post_labels').delete().eq('blog_post_id', id);
      
      if (body.label_ids.length > 0) {
        const labelInserts = body.label_ids.map(labelId => ({
          blog_post_id: id,
          label_id: labelId
        }));
        await supabase.from('blog_post_labels').insert(labelInserts);
      }
    }

    // Audit log
    const ipAddress = getClientIP(req);
    const userAgent = getUserAgent(req);
    await logBlogUpdate(
      { id: session.sub, email: session.email, role: session.role },
      id,
      existingPost.title,
      { fields_updated: Object.keys(updateData) },
      ipAddress,
      userAgent
    );

    return NextResponse.json({ post: updatedPost });
  } catch (error: any) {
    console.error('Update blog post error:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE - Delete blog post (marketing only)
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
    // Fetch post first
    const { data: post, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      throw fetchError;
    }

    // Delete labels first
    await supabase.from('blog_post_labels').delete().eq('blog_post_id', id);

    // Delete the post
    const { error: deleteError } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    // Audit log
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
  } catch (error: any) {
    console.error('Delete blog post error:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
