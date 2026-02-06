import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import db from '@/lib/db';

interface MediaItem {
    id: string;
    filename: string;
    url: string;
    size: number;
    content_type: string;
    uploaded_by: string;
    created_at: string;
    author_name?: string;
}

// GET - List all media from blog posts
export async function GET(request: NextRequest): Promise<NextResponse> {
    const authResult = await requirePermission('blog', 'read', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    try {
        // Get images from blog post featured images and content
        const result = await db.query<{
            id: string;
            featured_image_url: string | null;
            author_id: string;
            created_at: string;
        }>(
            `SELECT id, featured_image_url, author_id, created_at
             FROM blog_posts 
             WHERE featured_image_url IS NOT NULL AND featured_image_url != ''
             ORDER BY created_at DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        // Transform to media items format
        const media: MediaItem[] = result.rows.map((row) => ({
            id: `featured-${row.id}`,
            filename: row.featured_image_url?.split('/').pop() || 'image.jpg',
            url: row.featured_image_url || '',
            size: 0, // Size not tracked
            content_type: 'image/jpeg',
            uploaded_by: row.author_id,
            created_at: row.created_at
        }));

        // Get total count
        const countResult = await db.query<{ count: string }>(
            `SELECT COUNT(*) as count FROM blog_posts 
             WHERE featured_image_url IS NOT NULL AND featured_image_url != ''`
        );

        return NextResponse.json({
            media,
            total: parseInt(countResult.rows[0]?.count || '0'),
            limit,
            offset
        });
    } catch (error) {
        console.error('Failed to fetch media:', error);
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}
