import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requirePermission } from '@/lib/auth';
import { generateSlug } from '@/lib/blog';
import { CreateBlogLabelRequest } from '@/types/auth';

// GET - List all labels
export async function GET(req: NextRequest) {
  const authResult = await requirePermission('blog', 'read', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const { data: labels, error } = await supabase
      .from('blog_labels')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json(labels);
  } catch (error: any) {
    console.error('Get labels error:', error);
    return NextResponse.json({ error: 'Failed to fetch labels' }, { status: 500 });
  }
}

// POST - Create new label (marketing only)
export async function POST(req: NextRequest) {
  const authResult = await requirePermission('blog', 'create', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const body: CreateBlogLabelRequest = await req.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'Label name is required' }, { status: 400 });
    }

    const slug = generateSlug(body.name);
    const color = body.color?.trim() || '#3B82F6';

    // Check if slug exists
    const { data: existing } = await supabase
      .from('blog_labels')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'Label with this name already exists' }, { status: 409 });
    }

    const { data: newLabel, error } = await supabase
      .from('blog_labels')
      .insert({
        name: body.name.trim(),
        slug,
        color
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(newLabel, { status: 201 });
  } catch (error: any) {
    console.error('Create label error:', error);
    return NextResponse.json({ error: 'Failed to create label' }, { status: 500 });
  }
}
