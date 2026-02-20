import "server-only";
import { query } from "./db";

interface BlogPostRow {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image_url: string;
    published_at: string;
    labels?: Array<{ blog_labels: Record<string, unknown> }>;
}

export async function getLatestBlogPosts(limit = 3): Promise<BlogPostRow[]> {
    try {
        const postsResult = await query<BlogPostRow>(`
      SELECT id, title, slug, excerpt, content, featured_image_url, published_at
      FROM blog_posts
      WHERE status = 'published'
      ORDER BY published_at DESC
      LIMIT $1
    `, [limit]);

        const posts = postsResult.rows;

        if (!posts || posts.length === 0) {
            return [];
        }

        for (const post of posts) {
            const labelsRes = await query(`
        SELECT bl.* FROM blog_labels bl
        JOIN blog_post_labels bpl ON bl.id = bpl.label_id
        WHERE bpl.blog_post_id = $1
      `, [post.id]);
            post.labels = labelsRes.rows.map((l: Record<string, unknown>) => ({ blog_labels: l }));
        }

        return posts;
    } catch (error) {
        console.error("Failed to fetch latest blog posts:", error);
        return [];
    }
}
