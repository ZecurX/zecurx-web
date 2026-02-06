import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import db from '@/lib/db';

interface BlogTemplate {
    id: string;
    name: string;
    description: string | null;
    content: string;
    category: string;
    is_active: boolean;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

// GET - List all templates
export async function GET(request: NextRequest): Promise<NextResponse> {
    const authResult = await requirePermission('blog', 'read', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
    }

    const url = new URL(request.url);
    const category = url.searchParams.get('category');

    try {
        let queryText = `SELECT * FROM blog_templates WHERE is_active = true`;
        const params: string[] = [];

        if (category) {
            params.push(category);
            queryText += ` AND category = $1`;
        }

        queryText += ` ORDER BY category, name`;

        const result = await db.query<BlogTemplate>(queryText, params);

        return NextResponse.json({ templates: result.rows });
    } catch (error) {
        console.error('Failed to fetch templates:', error);
        return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
    }
}

// POST - Create a new template
export async function POST(request: NextRequest): Promise<NextResponse> {
    const authResult = await requirePermission('blog', 'create', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
    }

    try {
        const { name, description, content, category } = await request.json();

        if (!name || !content) {
            return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });
        }

        const result = await db.query<BlogTemplate>(
            `INSERT INTO blog_templates (name, description, content, category, created_by)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [name, description || null, content, category || 'general', authResult.session.sub]
        );

        return NextResponse.json({ template: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('Failed to create template:', error);
        return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
    }
}
