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
}

// GET - Get a specific version
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    const authResult = await requirePermission('blog', 'read', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
    }

    const { id } = await params;

    try {
        const result = await db.query<BlogVersion>(
            `SELECT * FROM blog_post_versions WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Version not found' }, { status: 404 });
        }

        return NextResponse.json({ version: result.rows[0] });
    } catch (error) {
        console.error('Failed to fetch version:', error);
        return NextResponse.json({ error: 'Failed to fetch version' }, { status: 500 });
    }
}

// DELETE - Delete a specific version
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    const authResult = await requirePermission('blog', 'delete', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
    }

    const { id } = await params;

    try {
        const result = await db.query(
            `DELETE FROM blog_post_versions WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Version not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete version:', error);
        return NextResponse.json({ error: 'Failed to delete version' }, { status: 500 });
    }
}
