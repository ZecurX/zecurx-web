import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/blog
 * Public API to list published blog posts
 * No authentication required
 * 
 * Query parameters:
 * - search: string (searches in title and content)
 * - label: string (filter by label slug)
 * - page: number (default: 1)
 * - limit: number (default: 9, max: 50)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const search = searchParams.get('search')?.trim() || '';
    const labelSlug = searchParams.get('label')?.trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '9')));
    const offset = (page - 1) * limit;

    // Build base query - only published posts
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        author:admins!blog_posts_author_id_fkey(id, email, name),
        labels:blog_post_labels(
          blog_labels(id, name, slug, color)
        )
      `, { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Apply label filter
    if (labelSlug) {
      // First get the label ID
      const { data: label } = await supabase
        .from('blog_labels')
        .select('id')
        .eq('slug', labelSlug)
        .single();

      if (label) {
        // Get post IDs that have this label
        const { data: postLabels } = await supabase
          .from('blog_post_labels')
          .select('blog_post_id')
          .eq('label_id', label.id);

        if (postLabels && postLabels.length > 0) {
          const postIds = postLabels.map(pl => pl.blog_post_id);
          query = query.in('id', postIds);
        } else {
          // No posts with this label
          return NextResponse.json({
            posts: [],
            pagination: {
              page,
              limit,
              total: 0,
              total_pages: 0
            }
          });
        }
      } else {
        // Label not found
        return NextResponse.json({
          posts: [],
          pagination: {
            page,
            limit,
            total: 0,
            total_pages: 0
          }
        });
      }
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data: posts, error, count } = await query;

    if (error) {
      throw error;
    }

    // Transform posts
    const transformedPosts = (posts || []).map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      featured_image_url: post.featured_image_url,
      published_at: post.published_at,
      view_count: post.view_count,
      author: post.author ? {
        id: (post.author as any).id,
        email: (post.author as any).email,
        name: (post.author as any).name
      } : null,
      labels: post.labels.map((l: any) => l.blog_labels).filter(Boolean)
    }));

    return NextResponse.json({
      posts: transformedPosts,
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching public blog posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
