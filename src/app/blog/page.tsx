import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { calculateReadingTime, formatBlogDate } from '@/lib/blog';

export const metadata = {
  title: 'Blog - ZecurX',
  description: 'Latest insights, news, and security research from the ZecurX team.',
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; label?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const limit = 9;
  const offset = (page - 1) * limit;
  const search = resolvedParams.search || '';
  const labelSlug = resolvedParams.label || '';

  // Build query
  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      author:admins!blog_posts_author_id_fkey(name, email),
      labels:blog_post_labels(
        blog_labels(id, name, slug, color)
      )
    `, { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  if (labelSlug) {
    const { data: label } = await supabase
      .from('blog_labels')
      .select('id')
      .eq('slug', labelSlug)
      .single();

    if (label) {
      const { data: postLabels } = await supabase
        .from('blog_post_labels')
        .select('post_id')
        .eq('label_id', label.id);

      if (postLabels && postLabels.length > 0) {
        query = query.in('id', postLabels.map(pl => pl.post_id));
      } else {
        query = query.eq('id', '00000000-0000-0000-0000-000000000000'); // Force empty
      }
    } else {
      query = query.eq('id', '00000000-0000-0000-0000-000000000000'); // Force empty
    }
  }

  const { data: posts, count } = await query.range(offset, offset + limit - 1);
  const totalPages = Math.ceil((count || 0) / limit);

  // Fetch labels for filter
  const { data: allLabels } = await supabase
    .from('blog_labels')
    .select('*')
    .order('name');

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Latest <span className="text-primary">Security Insights</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Expert analysis, industry news, and guides to help you stay ahead of threats.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-card/40 border border-border/50 rounded-2xl backdrop-blur-sm">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          <Link
            href="/blog"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !labelSlug 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            All Posts
          </Link>
          {allLabels?.map(label => (
            <Link
              key={label.id}
              href={`/blog?label=${label.slug}${search ? `&search=${search}` : ''}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                labelSlug === label.slug
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {label.name}
            </Link>
          ))}
        </div>

        <form className="relative w-full md:w-64">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search articles..."
            className="w-full pl-4 pr-10 py-2 bg-background/50 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <ArrowRight className="w-4 h-4" />
          </button>
          {labelSlug && <input type="hidden" name="label" value={labelSlug} />}
        </form>
      </div>

      {/* Posts Grid */}
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-card/40 border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="relative aspect-video bg-muted overflow-hidden">
                {post.featured_image_url ? (
                  <Image
                    src={post.featured_image_url}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                    <span className="text-4xl">📄</span>
                  </div>
                )}
                {/* Labels Overlay */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {post.labels.map((l: any) => (
                    <span
                      key={l.blog_labels.id}
                      className="px-2 py-1 text-xs font-semibold text-white rounded-full shadow-sm"
                      style={{ backgroundColor: l.blog_labels.color }}
                    >
                      {l.blog_labels.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1 p-6 space-y-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.published_at ? formatBlogDate(post.published_at) : ''}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{calculateReadingTime(post.content)} min read</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-muted-foreground text-sm line-clamp-3">
                  {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                </p>

                <div className="pt-4 mt-auto flex items-center justify-between border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {(post.author as any)?.name?.charAt(0) || 'Z'}
                    </div>
                    <span className="text-sm font-medium">{(post.author as any)?.name || 'ZecurX Team'}</span>
                  </div>
                  <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <h3 className="text-2xl font-bold mb-2">No posts found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-8">
          {page > 1 && (
            <Link
              href={`/blog?page=${page - 1}${search ? `&search=${search}` : ''}${labelSlug ? `&label=${labelSlug}` : ''}`}
              className="px-4 py-2 border border-border rounded-full hover:bg-muted transition-colors"
            >
              Previous
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/blog?page=${p}${search ? `&search=${search}` : ''}${labelSlug ? `&label=${labelSlug}` : ''}`}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                p === page
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border hover:bg-muted'
              }`}
            >
              {p}
            </Link>
          ))}
          {page < totalPages && (
            <Link
              href={`/blog?page=${page + 1}${search ? `&search=${search}` : ''}${labelSlug ? `&label=${labelSlug}` : ''}`}
              className="px-4 py-2 border border-border rounded-full hover:bg-muted transition-colors"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
