import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import db from '@/lib/db';

interface BlogVersion {
    id: string;
    blog_post_id: string;
    version_number: number;
    title: string;
    content: string;
    excerpt: string | null;
    featured_image_url: string | null;
    meta_description: string | null;
    created_by: string;
    created_at: string;
    author_name?: string;
}

// GET - List versions for a blog post
export async function GET(request: NextRequest): Promise<NextResponse> {
    const authResult = await requirePermission('blog', 'read', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
    }

    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');

    if (!postId) {
        return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    try {
        const result = await db.query<BlogVersion & { author_name: string }>(
            `SELECT v.*, a.name as author_name 
             FROM blog_post_versions v
             LEFT JOIN admins a ON v.created_by = a.id
             WHERE v.blog_post_id = $1
             ORDER BY v.version_number DESC
             LIMIT 20`,
            [postId]
        );

        return NextResponse.json({ versions: result.rows });
    } catch (error) {
        console.error('Failed to fetch versions:', error);
        return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 });
    }
}

// POST - Create a new version
export async function POST(request: NextRequest): Promise<NextResponse> {
    const authResult = await requirePermission('blog', 'update', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
    }

    try {
        const { postId } = await request.json();

        if (!postId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        // Get current post data
        const postResult = await db.query<{
            title: string;
            content: string;
            excerpt: string | null;
            featured_image_url: string | null;
            meta_description: string | null;
        }>(
            `SELECT title, content, excerpt, featured_image_url, meta_description
             FROM blog_posts WHERE id = $1`,
            [postId]
        );

        if (postResult.rows.length === 0) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const post = postResult.rows[0];

        // Get latest version number
        const latestResult = await db.query<{ version_number: number }>(
            `SELECT version_number FROM blog_post_versions
             WHERE blog_post_id = $1
             ORDER BY version_number DESC
             LIMIT 1`,
            [postId]
        );

        const newVersionNumber = (latestResult.rows[0]?.version_number || 0) + 1;

        // Create new version
        const versionResult = await db.query<BlogVersion>(
            `INSERT INTO blog_post_versions 
             (blog_post_id, version_number, title, content, excerpt, featured_image_url, meta_description, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [
                postId,
                newVersionNumber,
                post.title,
                post.content,
                post.excerpt,
                post.featured_image_url,
                post.meta_description,
                authResult.session.sub
            ]
        );

        return NextResponse.json({ version: versionResult.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('Failed to create version:', error);
        return NextResponse.json({ error: 'Failed to create version' }, { status: 500 });
    }
}
