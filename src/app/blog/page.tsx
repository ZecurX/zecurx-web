import Link from 'next/link';
import Image from 'next/image';
import { query } from '@/lib/db';
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

  let countQuery = `SELECT COUNT(*) as total FROM blog_posts WHERE status = 'published'`;
  let postsQuery = `
    SELECT bp.*, 
           a.name as author_name, a.email as author_email
    FROM blog_posts bp
    LEFT JOIN admins a ON bp.author_id = a.id
    WHERE bp.status = 'published'
  `;
  const params: any[] = [];
  let paramIndex = 1;

  if (search) {
    const searchCondition = ` AND (bp.title ILIKE $${paramIndex} OR bp.content ILIKE $${paramIndex})`;
    postsQuery += searchCondition;
    countQuery += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (labelSlug) {
    const labelResult = await query('SELECT id FROM blog_labels WHERE slug = $1 LIMIT 1', [labelSlug]);
    if (labelResult.rows.length > 0) {
      const labelId = labelResult.rows[0].id;
      const labelCondition = ` AND bp.id IN (SELECT blog_post_id FROM blog_post_labels WHERE label_id = $${paramIndex})`;
      postsQuery += labelCondition;
      countQuery += ` AND id IN (SELECT blog_post_id FROM blog_post_labels WHERE label_id = $${paramIndex})`;
      params.push(labelId);
      paramIndex++;
    } else {
      return (
        <div className="space-y-12">
          <div className="text-center py-24">
            <h3 className="text-2xl font-bold mb-2">No posts found</h3>
            <p className="text-muted-foreground">Label not found.</p>
          </div>
        </div>
      );
    }
  }

  postsQuery += ` ORDER BY bp.published_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  const countParams = params.slice();
  params.push(limit, offset);

  try {
    const [countResult, postsResult, labelsResult] = await Promise.all([
      query(countQuery, countParams),
      query(postsQuery, params),
      query('SELECT * FROM blog_labels ORDER BY name')
    ]);

    const count = parseInt(countResult.rows[0]?.total || '0');
    const posts = postsResult.rows;
    const allLabels = labelsResult.rows;
    const totalPages = Math.ceil(count / limit);

    for (const post of posts) {
      const labelsRes = await query(`
        SELECT bl.* FROM blog_labels bl
        JOIN blog_post_labels bpl ON bl.id = bpl.label_id
        WHERE bpl.blog_post_id = $1
      `, [post.id]);
      post.labels = labelsRes.rows.map((l: any) => ({ blog_labels: l }));
      post.author = { name: post.author_name, email: post.author_email };
    }

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
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return (
      <div className="text-center py-24 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="text-primary">Blog</span>
        </h1>
        <div className="p-8 bg-card/40 border border-border/50 rounded-2xl max-w-lg mx-auto">
          <h3 className="text-xl font-bold mb-2">Temporarily Unavailable</h3>
          <p className="text-muted-foreground">
            We are currently unable to load the blog posts. Please try again later.
          </p>
        </div>
      </div>
    );
  }
