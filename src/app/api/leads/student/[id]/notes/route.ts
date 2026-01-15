import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// POST - Add note to student lead
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        if (!body.content || body.content.trim() === '') {
            return NextResponse.json(
                { error: 'Note content is required' },
                { status: 400 }
            );
        }

        // Check if lead exists
        const { data: lead, error: leadError } = await supabase
            .from('student_leads')
            .select('id')
            .eq('id', id)
            .single();

        if (leadError || !lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        // Insert note
        const { data, error } = await supabase
            .from('student_lead_notes')
            .insert({
                lead_id: id,
                content: body.content.trim(),
                created_by: body.created_by || null,
            })
            .select()
            .single();

        if (error) throw error;

        // Log activity
        await supabase.from('student_lead_activities').insert({
            lead_id: id,
            activity_type: 'NOTE_ADDED',
            description: 'Note added to lead',
            performed_by: body.created_by || null,
        });

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error adding note:', error);
        return NextResponse.json(
            { error: 'Failed to add note' },
            { status: 500 }
        );
    }
}

// GET - Get notes for a student lead
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const { data, error } = await supabase
            .from('student_lead_notes')
            .select('*')
            .eq('lead_id', id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ data: data || [] });
    } catch (error) {
        console.error('Error fetching notes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notes' },
            { status: 500 }
        );
    }
}
