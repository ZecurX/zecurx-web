import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET - Fetch single student lead with notes, activities, emails
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Fetch lead with related data
        const { data: lead, error: leadError } = await supabase
            .from('student_leads')
            .select('*')
            .eq('id', id)
            .single();

        if (leadError) {
            if (leadError.code === 'PGRST116') {
                return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
            }
            throw leadError;
        }

        // Fetch notes
        const { data: notes } = await supabase
            .from('student_lead_notes')
            .select('*')
            .eq('lead_id', id)
            .order('created_at', { ascending: false });

        // Fetch activities
        const { data: activities } = await supabase
            .from('student_lead_activities')
            .select('*')
            .eq('lead_id', id)
            .order('created_at', { ascending: false });

        // Fetch emails
        const { data: emails } = await supabase
            .from('student_lead_emails')
            .select('*')
            .eq('lead_id', id)
            .order('sent_at', { ascending: false });

        return NextResponse.json({
            data: {
                ...lead,
                notes: notes || [],
                activities: activities || [],
                emails: emails || [],
            },
        });
    } catch (error) {
        console.error('Error fetching student lead:', error);
        return NextResponse.json(
            { error: 'Failed to fetch lead' },
            { status: 500 }
        );
    }
}

// PATCH - Update student lead
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const adminId = body._adminId; // Optional: passed from frontend for activity logging
        delete body._adminId;

        // Get old values for activity logging
        const { data: oldLead } = await supabase
            .from('student_leads')
            .select('status, priority, assigned_to')
            .eq('id', id)
            .single();

        // Build update object (only include provided fields)
        const updateData: Record<string, unknown> = {};
        const allowedFields = [
            'full_name', 'email', 'phone', 'alternate_phone', 'date_of_birth',
            'current_education', 'field_of_interest', 'preferred_course',
            'intake_year', 'intake_season', 'message',
            'status', 'priority', 'assigned_to',
            'last_contacted_at', 'next_followup_at', 'conversion_date'
        ];

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        // Update lead
        const { data, error } = await supabase
            .from('student_leads')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Log activities for significant changes
        const activities = [];

        if (oldLead?.status !== data.status) {
            activities.push({
                lead_id: id,
                activity_type: 'STATUS_CHANGED',
                description: `Status changed from ${oldLead?.status} to ${data.status}`,
                old_value: oldLead?.status,
                new_value: data.status,
                performed_by: adminId || null,
            });
        }

        if (oldLead?.priority !== data.priority) {
            activities.push({
                lead_id: id,
                activity_type: 'PRIORITY_CHANGED',
                description: `Priority changed from ${oldLead?.priority} to ${data.priority}`,
                old_value: oldLead?.priority,
                new_value: data.priority,
                performed_by: adminId || null,
            });
        }

        if (oldLead?.assigned_to !== data.assigned_to) {
            activities.push({
                lead_id: id,
                activity_type: 'ASSIGNED',
                description: data.assigned_to ? 'Lead assigned to team member' : 'Lead unassigned',
                old_value: oldLead?.assigned_to,
                new_value: data.assigned_to,
                performed_by: adminId || null,
            });
        }

        if (activities.length > 0) {
            await supabase.from('student_lead_activities').insert(activities);
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error updating student lead:', error);
        return NextResponse.json(
            { error: 'Failed to update lead' },
            { status: 500 }
        );
    }
}

// DELETE - Delete student lead
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const { error } = await supabase
            .from('student_leads')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting student lead:', error);
        return NextResponse.json(
            { error: 'Failed to delete lead' },
            { status: 500 }
        );
    }
}
