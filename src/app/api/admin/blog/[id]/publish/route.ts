import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requirePermission, getClientIP, getUserAgent } from '@/lib/auth';
import { logBlogPublish } from '@/lib/audit';

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
    const postResult = await db.query<{
      id: string;
      title: string;
      status: string;
    }>(
      'SELECT id, title, status FROM blog_posts WHERE id = $1',
      [id]
    );

    if (postResult.rows.length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const post = postResult.rows[0];
    const newStatus = post.status === 'published' ? 'draft' : 'published';

    const updateResult = await db.query<{
      id: string;
      title: string;
      slug: string;
      status: string;
      published_at: string | null;
      updated_at: string;
    }>(
      `UPDATE blog_posts 
      SET status = $1, 
          published_at = $2,
          updated_at = NOW()
      WHERE id = $3 
      RETURNING *`,
      [
        newStatus,
        newStatus === 'published' ? new Date().toISOString() : null,
        id
      ]
    );

    const updatedPost = updateResult.rows[0];

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
  } catch (error) {
    console.error('Toggle publish error:', error);
    return NextResponse.json({ error: 'Failed to toggle publish status' }, { status: 500 });
  }
}
