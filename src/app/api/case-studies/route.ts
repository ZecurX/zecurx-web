import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const conditions: string[] = ['status = $1'];
    const values: unknown[] = ['published'];
    let paramIndex = 2;

    if (category) {
      conditions.push(`category = $${paramIndex++}`);
      values.push(category);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const countResult = await db.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM case_studies ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    const caseStudiesResult = await db.query<{
      id: string;
      title: string;
      slug: string;
      summary: string;
      category: string;
      pages: number;
      cover_image_url: string | null;
      pdf_url: string;
      published_at: string | null;
      download_count: number;
    }>(
      `SELECT 
        id, title, slug, summary, category, pages, 
        cover_image_url, pdf_url, published_at, download_count
      FROM case_studies
      ${whereClause}
      ORDER BY published_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, limit, offset]
    );

    const categoriesResult = await db.query<{ category: string; count: string }>(
      `SELECT category, COUNT(*) as count 
       FROM case_studies 
       WHERE status = 'published' 
       GROUP BY category 
       ORDER BY count DESC`
    );

    return NextResponse.json({
      caseStudies: caseStudiesResult.rows,
      categories: categoriesResult.rows.map(r => ({
        label: r.category,
        count: parseInt(r.count)
      })),
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get case studies error:', error);
    return NextResponse.json({ error: 'Failed to fetch case studies' }, { status: 500 });
  }
}
