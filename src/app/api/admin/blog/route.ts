import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requirePermission, getClientIP, getUserAgent } from '@/lib/auth';
import { logBlogCreate } from '@/lib/audit';
import { generateSlug } from '@/lib/blog';
import { CreateBlogPostRequest } from '@/types/auth';

// GET - List all blog posts (with filters)
export async function GET(req: NextRequest) {
  const authResult = await requirePermission('blog', 'read', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const labelId = searchParams.get('label_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        admins!blog_posts_author_id_fkey(name, email)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const { data: posts, error, count } = await query;

    if (error) throw error;

    // Fetch labels for each post
    const postsWithLabels = await Promise.all(
      (posts || []).map(async (post) => {
        const { data: labelData } = await supabase
          .from('blog_post_labels')
          .select('blog_labels(*)')
          .eq('blog_post_id', post.id);

        return {
          ...post,
          author_name: (post.admins as any)?.name,
          author_email: (post.admins as any)?.email,
          labels: labelData?.map((item: any) => item.blog_labels) || [],
        };
      })
    );

    // Filter by label if specified
    let filteredPosts = postsWithLabels;
    if (labelId) {
      filteredPosts = postsWithLabels.filter(post => 
        post.labels.some((label: any) => label.id === labelId)
      );
    }

    return NextResponse.json({
      posts: filteredPosts,
      total: labelId ? filteredPosts.length : count,
      page,
      limit,
    });
  } catch (error: any) {
    console.error('Get blog posts error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// POST - Create new blog post (marketing only)
export async function POST(req: NextRequest) {
  const authResult = await requirePermission('blog', 'create', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { session } = authResult;

  try {
    const body: CreateBlogPostRequest = await req.json();
    const { title, slug, content, excerpt, featured_image_url, status, meta_description, label_ids } = body;

    // Validation
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Generate or validate slug
    const finalSlug = slug || generateSlug(title);

    // Check if slug already exists
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', finalSlug)
      .maybeSingle();

    if (existingPost) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    // Create blog post
    const { data: newPost, error: createError } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug: finalSlug,
        content,
        excerpt: excerpt || null,
        featured_image_url: featured_image_url || null,
        author_id: session.sub,
        status: status || 'draft',
        published_at: status === 'published' ? new Date().toISOString() : null,
        meta_description: meta_description || null,
      })
      .select()
      .single();

    if (createError) throw createError;

    // Add labels if provided
    if (label_ids && label_ids.length > 0) {
      const labelInserts = label_ids.map(labelId => ({
        blog_post_id: newPost.id,
        label_id: labelId,
      }));

      await supabase.from('blog_post_labels').insert(labelInserts);
    }

    // Audit log
    const ipAddress = getClientIP(req);
    const userAgent = getUserAgent(req);
    await logBlogCreate(
      { id: session.sub, email: session.email, role: session.role },
      newPost.id,
      title,
      ipAddress,
      userAgent
    );

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error: any) {
    console.error('Create blog post error:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
