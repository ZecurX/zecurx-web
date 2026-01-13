import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/blog/[slug]
 * Public API to fetch a single published blog post by slug
 * No authentication required
 * 
 * Features:
 * - Increments view_count
 * - Returns related posts (same labels, limit 3)
 * - Only returns published posts
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch blog post by slug (only published)
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:admins!blog_posts_author_id_fkey(id, email, name),
        labels:blog_post_labels(
          blog_labels(id, name, slug, color)
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (postError) {
      if (postError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      throw postError;
    }

    // Increment view count
    await supabase
      .from('blog_posts')
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq('id', post.id);

    // Transform labels
    const transformedLabels = post.labels.map((l: any) => l.blog_labels).filter(Boolean);

    // Get related posts (same labels, limit 3, exclude current post)
    let relatedPosts: any[] = [];
    
    if (transformedLabels.length > 0) {
      const labelIds = transformedLabels.map((l: any) => l.id);

      // Get posts that share at least one label
      const { data: relatedPostLabels } = await supabase
        .from('blog_post_labels')
        .select('post_id')
        .in('label_id', labelIds)
        .neq('post_id', post.id);

      if (relatedPostLabels && relatedPostLabels.length > 0) {
        // Get unique post IDs
        const relatedPostIds = [...new Set(relatedPostLabels.map(rpl => rpl.post_id))];

        // Fetch related posts (limit 3, most recent)
        const { data: related } = await supabase
          .from('blog_posts')
          .select(`
            id,
            title,
            slug,
            excerpt,
            featured_image,
            featured_image_url,
            published_at,
            view_count,
            author:admins!blog_posts_author_id_fkey(id, email, name),
            labels:blog_post_labels(
              blog_labels(id, name, slug, color)
            )
          `)
          .in('id', relatedPostIds)
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(3);

        if (related) {
          relatedPosts = related.map(rp => ({
            ...rp,
            author: rp.author,
            labels: rp.labels.map((l: any) => l.blog_labels).filter(Boolean)
          }));
        }
      }
    }

    // Build response
    const response = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      featured_image: post.featured_image,
      featured_image_url: post.featured_image_url,
      meta_title: post.meta_title,
      meta_description: post.meta_description,
      published_at: post.published_at,
      view_count: (post.view_count || 0) + 1, // Return incremented count
      author: post.author ? {
        id: (post.author as any).id,
        email: (post.author as any).email,
        name: (post.author as any).name
      } : null,
      labels: transformedLabels,
      related_posts: relatedPosts
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
