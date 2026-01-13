import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, ArrowLeft, Tag, Twitter, Linkedin, Facebook, Copy } from 'lucide-react';
import { calculateReadingTime, formatBlogDate } from '@/lib/blog';
import ViewIncrement from '@/components/blog/ViewIncrement';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, featured_image_url, meta_title, meta_description')
    .eq('slug', slug)
    .single();

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: post.featured_image_url ? [{ url: post.featured_image_url }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  
  // Fetch post details
  const { data: post } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:admins!blog_posts_author_id_fkey(name, email),
      labels:blog_post_labels(
        blog_labels(id, name, slug, color)
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    notFound();
  }

  // Fetch related posts (same labels)
  let relatedPosts: any[] = [];
  if (post.labels && post.labels.length > 0) {
    const labelIds = post.labels.map((l: any) => l.blog_labels.id);
    const { data: related } = await supabase
      .from('blog_post_labels')
      .select('post_id')
      .in('label_id', labelIds)
      .neq('post_id', post.id)
      .limit(3);

    if (related && related.length > 0) {
      const relatedIds = [...new Set(related.map(r => r.post_id))];
      const { data: posts } = await supabase
        .from('blog_posts')
        .select(`
          id, title, slug, excerpt, featured_image_url, published_at,
          labels:blog_post_labels(blog_labels(id, name, color))
        `)
        .in('id', relatedIds)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);
        
      if (posts) relatedPosts = posts;
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ViewIncrement slug={slug} />

      {/* Back Link */}
      <Link 
        href="/blog" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Blog
      </Link>

      {/* Header */}
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {post.labels.map((l: any) => (
            <Link
              key={l.blog_labels.id}
              href={`/blog?label=${l.blog_labels.slug}`}
              className="px-3 py-1 text-sm font-semibold text-white rounded-full transition-opacity hover:opacity-90"
              style={{ backgroundColor: l.blog_labels.color }}
            >
              {l.blog_labels.name}
            </Link>
          ))}
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-border/50 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              {(post.author as any)?.name?.charAt(0) || 'Z'}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">{(post.author as any)?.name || 'ZecurX Team'}</span>
              <span>Author</span>
            </div>
          </div>
          
          <div className="w-px h-8 bg-border/50 hidden sm:block" />
          
          <div className="flex flex-col">
             <div className="flex items-center gap-1.5">
               <Calendar className="w-4 h-4" />
               <span>Published</span>
             </div>
             <span>{formatBlogDate(post.published_at || post.created_at)}</span>
          </div>

          <div className="w-px h-8 bg-border/50 hidden sm:block" />

          <div className="flex flex-col">
             <div className="flex items-center gap-1.5">
               <Clock className="w-4 h-4" />
               <span>Read Time</span>
             </div>
             <span>{calculateReadingTime(post.content)} min read</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featured_image_url && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-muted shadow-lg">
          <Image
            src={post.featured_image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      )}

      {/* Content */}
      <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      {/* Tags & Share */}
      <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-2">
           <Tag className="w-4 h-4 text-muted-foreground" />
           <span className="text-sm font-medium text-muted-foreground">Tags:</span>
           <div className="flex flex-wrap gap-2">
              {post.labels.map((l: any) => (
                <span key={l.blog_labels.id} className="text-sm text-foreground bg-muted px-2 py-1 rounded-md">
                   {l.blog_labels.name}
                </span>
              ))}
           </div>
        </div>

        {/* Share Buttons (Placeholder logic) */}
        <div className="flex items-center gap-3">
           <span className="text-sm font-medium text-muted-foreground">Share:</span>
           <div className="flex gap-2">
              <button className="p-2 bg-muted/50 hover:bg-muted rounded-full transition-colors text-foreground" aria-label="Share on Twitter">
                 <Twitter className="w-4 h-4" />
              </button>
              <button className="p-2 bg-muted/50 hover:bg-muted rounded-full transition-colors text-foreground" aria-label="Share on LinkedIn">
                 <Linkedin className="w-4 h-4" />
              </button>
              <button className="p-2 bg-muted/50 hover:bg-muted rounded-full transition-colors text-foreground" aria-label="Share on Facebook">
                 <Facebook className="w-4 h-4" />
              </button>
              <button className="p-2 bg-muted/50 hover:bg-muted rounded-full transition-colors text-foreground" aria-label="Copy Link">
                 <Copy className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="pt-12 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rp) => (
              <Link 
                key={rp.id} 
                href={`/blog/${rp.slug}`}
                className="group flex flex-col bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-md transition-all"
              >
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {rp.featured_image_url ? (
                    <Image
                      src={rp.featured_image_url}
                      alt={rp.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                       <span className="text-2xl">📄</span>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                   <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                     {rp.title}
                   </h3>
                   <span className="text-xs text-muted-foreground">
                     {formatBlogDate(rp.published_at)}
                   </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
