import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requirePermission, getClientIP, getUserAgent } from '@/lib/auth';
import { logBlogPublish } from '@/lib/audit';

// POST - Toggle publish/unpublish
export async function POST(
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
    // Fetch current post
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

    // Toggle status
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    const publishedAt = newStatus === 'published' ? new Date().toISOString() : null;

    // Update
    const { data: updatedPost, error: updateError } = await supabase
      .from('blog_posts')
      .update({
        status: newStatus,
        published_at: publishedAt,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Audit log
    const ipAddress = getClientIP(req);
    const userAgent = getUserAgent(req);
    await logBlogPublish(
      { id: session.sub, email: session.email, role: session.role },
      id,
      post.title,
      newStatus === 'published',
      ipAddress,
      userAgent
    );

    return NextResponse.json({
      success: true,
      message: newStatus === 'published' ? 'Blog post published' : 'Blog post unpublished',
      post: updatedPost
    });
  } catch (error: any) {
    console.error('Toggle publish error:', error);
    return NextResponse.json({ error: 'Failed to toggle publish status' }, { status: 500 });
  }
}
