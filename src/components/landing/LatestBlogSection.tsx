import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { formatBlogDate, calculateReadingTime } from '@/lib/blog';

export default async function LatestBlogSection() {
  // Fetch latest 3 published posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select(`
      id, title, slug, excerpt, content, featured_image_url, published_at,
      labels:blog_post_labels(blog_labels(id, name, color))
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3);

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Latest <span className="text-primary">Insights</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Stay ahead of the curve with our latest cybersecurity research, news, and expert analysis.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  {post.labels?.slice(0, 1).map((l: any) => (
                    <span
                      key={l.blog_labels.id}
                      className="px-2 py-1 text-xs font-semibold text-white rounded-full shadow-sm"
                      style={{ backgroundColor: l.blog_labels.color }}
                    >
                      {l.blog_labels.name}
                    </span>
                  ))}
                  {post.labels && post.labels.length > 1 && (
                     <span className="px-2 py-1 text-xs font-semibold bg-black/50 text-white rounded-full backdrop-blur-sm">
                        +{post.labels.length - 1}
                     </span>
                  )}
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
                    <span>{calculateReadingTime(post.content)} min</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-muted-foreground text-sm line-clamp-2">
                  {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...'}
                </p>

                <span className="text-primary text-sm font-semibold flex items-center gap-1 mt-auto pt-2 group-hover:gap-2 transition-all">
                  Read Article <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
