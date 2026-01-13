import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Generate URL-friendly slug from title
 * Example: "Hello World!" => "hello-world"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Extract plain text from HTML content
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Format date for display
 */
export function formatBlogDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Calculate reading time estimate
 * Assumes ~200 words per minute
 */
export function calculateReadingTime(content: string): number {
  const plainText = stripHtml(content);
  const wordCount = plainText.split(/\s+/).length;
  return Math.ceil(wordCount / 200);
}

/**
 * Check if image is used in any blog posts
 */
export async function isImageUsedInPosts(supabase: SupabaseClient, imageUrl: string): Promise<boolean> {
  // Check featured images
  const { count: featuredCount } = await supabase
    .from('blog_posts')
    .select('id', { count: 'exact', head: true })
    .eq('featured_image_url', imageUrl);
  
  if (featuredCount && featuredCount > 0) return true;
  
  // Check content (images embedded in content)
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('content')
    .ilike('content', `%${imageUrl}%`);
  
  return (posts && posts.length > 0) || false;
}

/**
 * Validate blog post slug
 */
export async function isSlugAvailable(supabase: SupabaseClient, slug: string, excludePostId?: string): Promise<boolean> {
  let query = supabase
    .from('blog_posts')
    .select('id', { count: 'exact', head: true })
    .eq('slug', slug);
  
  if (excludePostId) {
    query = query.neq('id', excludePostId);
  }
  
  const { count } = await query;
  return count === 0;
}
