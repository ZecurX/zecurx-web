"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, Search, TrendingUp, Sparkles } from 'lucide-react';
import { calculateReadingTime, formatBlogDate } from '@/lib/blog-utils';
import { motion } from 'framer-motion';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { cn } from '@/lib/utils';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

function AnimatedGridPattern({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem]"
        style={{
          maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%)",
        }}
      />
    </div>
  );
}

interface BlogPageClientProps {
  posts?: any[];
  allLabels?: any[];
  page?: number;
  totalPages?: number;
  search?: string;
  labelSlug?: string;
  error?: 'label_not_found' | 'fetch_failed';
}

export function BlogPageClient({
  posts,
  allLabels,
  page = 1,
  totalPages = 1,
  search = '',
  labelSlug = '',
  error
}: BlogPageClientProps) {
  if (error === 'label_not_found') {
    return (
      <div className="relative w-full min-h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] opacity-20" />
          <AnimatedGridPattern className="opacity-50" />
        </div>

        <ScrollAnimation direction="up">
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold font-manrope mb-3 text-foreground">No posts found</h3>
            <p className="text-muted-foreground text-lg">Label not found.</p>
          </div>
        </ScrollAnimation>
      </div>
    );
  }

  if (error === 'fetch_failed') {
    return (
      <div className="relative w-full min-h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] opacity-20" />
          <AnimatedGridPattern className="opacity-50" />
        </div>

        <ScrollAnimation direction="up">
          <div className="relative z-10 text-center p-8 lg:p-12 bg-card/40 border border-border/50 rounded-3xl max-w-lg mx-auto backdrop-blur-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold font-manrope mb-4 text-foreground">
              Temporarily Unavailable
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We're currently unable to load the blog posts. Please try again later.
            </p>
          </div>
        </ScrollAnimation>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-30 dark:opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] opacity-20 dark:opacity-15" />
        <AnimatedGridPattern className="opacity-100 dark:opacity-100" />
      </div>

      <ScrollAnimation direction="up">
        <div className="relative z-10 text-center mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-muted/50 border border-border/50 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Latest Security Research & Insights
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-manrope tracking-tighter leading-tight mb-6">
            <span className="block text-foreground">Security</span>
            <span className="block bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50 bg-clip-text text-transparent">
              Intelligence Hub
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Expert analysis, threat intelligence, and industry insights from the ZecurX security team.
          </p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation direction="up" delay={0.1}>
        <div className="relative z-10 mb-12 lg:mb-16">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between p-4 lg:p-8 bg-card/40 border border-border/50 rounded-3xl backdrop-blur-xl">
            {/* Mobile: Horizontal Scroll, Desktop: Wrap */}
            <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 no-scrollbar">
              <div className="flex lg:flex-wrap gap-2 lg:gap-3 min-w-max lg:min-w-0">
                <Link
                  href="/blog"
                  className={cn(
                    "px-4 lg:px-5 py-2 lg:py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                    !labelSlug
                      ? 'bg-foreground text-background shadow-lg'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50'
                  )}
                >
                  All Posts
                </Link>
                {allLabels?.map(label => (
                  <Link
                    key={label.id}
                    href={`/blog?label=${label.slug}${search ? `&search=${search}` : ''}`}
                    className={cn(
                      "px-4 lg:px-5 py-2 lg:py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                      labelSlug === label.slug
                        ? 'bg-foreground text-background shadow-lg'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50'
                    )}
                  >
                    {label.name}
                  </Link>
                ))}
              </div>
            </div>

            <form className="relative w-full lg:w-80 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                name="search"
                defaultValue={search}
                placeholder="Search articles..."
                className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm placeholder:text-muted-foreground"
              />
              {labelSlug && <input type="hidden" name="label" value={labelSlug} />}
            </form>
          </div>
        </div>
      </ScrollAnimation>

      {posts && posts.length > 0 ? (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post, index) => (
            <ScrollAnimation key={post.id} direction="up" delay={0.05 * index}>
              <Link
                href={`/blog/${post.slug}`}
                className="group h-full flex flex-col bg-card/40 border border-border/50 rounded-3xl overflow-hidden hover:border-foreground/20 hover:bg-card/60 transition-all duration-500 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                  {post.featured_image_url ? (
                    <Image
                      src={post.featured_image_url}
                      alt={post.title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/5 via-primary/10 to-blue-500/5 flex items-center justify-center">
                      <TrendingUp className="w-16 h-16 text-primary/20" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {post.labels.length > 0 && (
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {post.labels.slice(0, 2).map((l: any) => (
                        <span
                          key={l.blog_labels.id}
                          className="px-3 py-1 text-xs font-semibold text-white rounded-full shadow-lg backdrop-blur-sm"
                          style={{ backgroundColor: l.blog_labels.color }}
                        >
                          {l.blog_labels.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 p-6 lg:p-8 space-y-4 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.published_at ? formatBlogDate(post.published_at) : ''}</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-border" />
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{calculateReadingTime(post.content)} min</span>
                    </div>
                  </div>

                  <h3 className="text-xl lg:text-2xl font-bold font-manrope group-hover:text-foreground transition-colors line-clamp-2 text-foreground/90">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-grow">
                    {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                  </p>

                  <div className="pt-4 mt-auto flex items-center justify-between border-t border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {(post.author as any)?.name?.charAt(0) || 'Z'}
                      </div>
                      <span className="text-sm font-medium text-foreground/80">{(post.author as any)?.name || 'ZecurX Team'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-foreground group-hover:gap-2 transition-all duration-300">
                      <span className="text-sm font-semibold">Read</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollAnimation>
          ))}
        </div>
      ) : (
        <ScrollAnimation direction="up">
          <div className="relative z-10 text-center py-24 lg:py-32">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold font-manrope mb-3 text-foreground">No posts found</h3>
            <p className="text-muted-foreground text-lg">Try adjusting your search or filters.</p>
          </div>
        </ScrollAnimation>
      )}

      {totalPages > 1 && (
        <ScrollAnimation direction="up" delay={0.2}>
          <div className="relative z-10 flex flex-wrap justify-center gap-3 pt-16">
            {page > 1 && (
              <Link
                href={`/blog?page=${page - 1}${search ? `&search=${search}` : ''}${labelSlug ? `&label=${labelSlug}` : ''}`}
                className="px-6 py-3 border border-border rounded-full hover:bg-muted hover:border-foreground/20 transition-all duration-300 text-sm font-medium"
              >
                Previous
              </Link>
            )}
            <div className="flex gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <Link
                    key={pageNum}
                    href={`/blog?page=${pageNum}${search ? `&search=${search}` : ''}${labelSlug ? `&label=${labelSlug}` : ''}`}
                    className={cn(
                      "w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 text-sm font-medium",
                      pageNum === page
                        ? 'bg-foreground text-background shadow-lg'
                        : 'border border-border hover:bg-muted hover:border-foreground/20'
                    )}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>
            {page < totalPages && (
              <Link
                href={`/blog?page=${page + 1}${search ? `&search=${search}` : ''}${labelSlug ? `&label=${labelSlug}` : ''}`}
                className="px-6 py-3 border border-border rounded-full hover:bg-muted hover:border-foreground/20 transition-all duration-300 text-sm font-medium"
              >
                Next
              </Link>
            )}
          </div>
        </ScrollAnimation>
      )}
    </div>
  );
}
