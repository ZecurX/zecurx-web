import 'server-only';
import { query } from './db';

export { generateSlug, truncateText, stripHtml, formatBlogDate, calculateReadingTime } from './blog-utils';

export async function isImageUsedInPosts(imageUrl: string): Promise<boolean> {
  const featuredResult = await query<{ id: string }>(
    `SELECT id FROM blog_posts WHERE featured_image_url = $1 LIMIT 1`,
    [imageUrl]
  );
  
  if (featuredResult.rows.length > 0) return true;
  
  const contentResult = await query<{ id: string }>(
    `SELECT id FROM blog_posts WHERE content ILIKE $1 LIMIT 1`,
    [`%${imageUrl}%`]
  );
  
  return contentResult.rows.length > 0;
}

export async function isSlugAvailable(slug: string, excludePostId?: string): Promise<boolean> {
  let sql = `SELECT id FROM blog_posts WHERE slug = $1`;
  const params: unknown[] = [slug];
  
  if (excludePostId) {
    sql += ` AND id != $2`;
    params.push(excludePostId);
  }
  
  sql += ` LIMIT 1`;
  
  const result = await query<{ id: string }>(sql, params);
  return result.rows.length === 0;
}
