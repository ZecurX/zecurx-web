import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { StudentLead } from '@/types/lead-types';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const leadResult = await query<StudentLead>(
            `SELECT * FROM student_leads WHERE id = $1`,
            [id]
        );

        if (leadResult.rows.length === 0) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        const lead = leadResult.rows[0];

        const notesResult = await query(
            `SELECT * FROM student_lead_notes WHERE lead_id = $1 ORDER BY created_at DESC`,
            [id]
        );

        const activitiesResult = await query(
            `SELECT * FROM student_lead_activities WHERE lead_id = $1 ORDER BY created_at DESC`,
            [id]
        );

        const emailsResult = await query(
            `SELECT * FROM student_lead_emails WHERE lead_id = $1 ORDER BY sent_at DESC`,
            [id]
        );

        return NextResponse.json({
            data: {
                ...lead,
                notes: notesResult.rows,
                activities: activitiesResult.rows,
                emails: emailsResult.rows,
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

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const adminId = body._adminId;
        delete body._adminId;

        const oldLeadResult = await query<{ status: string; priority: string; assigned_to: string | null }>(
            `SELECT status, priority, assigned_to FROM student_leads WHERE id = $1`,
            [id]
        );
        const oldLead = oldLeadResult.rows[0];

        const allowedFields = [
            'full_name', 'email', 'phone', 'alternate_phone', 'date_of_birth',
            'current_education', 'field_of_interest', 'preferred_course',
            'intake_year', 'intake_season', 'message',
            'status', 'priority', 'assigned_to',
            'last_contacted_at', 'next_followup_at', 'conversion_date'
        ];

        const updateFields: string[] = [];
        const updateValues: unknown[] = [];
        let paramIndex = 1;

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateFields.push(`${field} = $${paramIndex++}`);
                updateValues.push(body[field]);
            }
        }

        if (updateFields.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        updateFields.push(`updated_at = NOW()`);
        updateValues.push(id);

        const result = await query<StudentLead>(
            `UPDATE student_leads SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            updateValues
        );

        const data = result.rows[0];

        const activities: { lead_id: string; activity_type: string; description: string; old_value: string | null; new_value: string | null; performed_by: string | null }[] = [];

        if (oldLead?.status !== data.status) {
            activities.push({
                lead_id: id,
                activity_type: 'STATUS_CHANGED',
                description: `Status changed from ${oldLead?.status} to ${data.status}`,
                old_value: oldLead?.status || null,
                new_value: data.status,
                performed_by: adminId || null,
            });
        }

        if (oldLead?.priority !== data.priority) {
            activities.push({
                lead_id: id,
                activity_type: 'PRIORITY_CHANGED',
                description: `Priority changed from ${oldLead?.priority} to ${data.priority}`,
                old_value: oldLead?.priority || null,
                new_value: data.priority,
                performed_by: adminId || null,
            });
        }

        if (oldLead?.assigned_to !== data.assigned_to) {
            activities.push({
                lead_id: id,
                activity_type: 'ASSIGNED',
                description: data.assigned_to ? 'Lead assigned to team member' : 'Lead unassigned',
                old_value: oldLead?.assigned_to || null,
                new_value: data.assigned_to || null,
                performed_by: adminId || null,
            });
        }

        for (const activity of activities) {
            await query(
                `INSERT INTO student_lead_activities (lead_id, activity_type, description, old_value, new_value, performed_by)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [activity.lead_id, activity.activity_type, activity.description, activity.old_value, activity.new_value, activity.performed_by]
            );
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

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await query(`DELETE FROM student_leads WHERE id = $1`, [id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting student lead:', error);
        return NextResponse.json(
            { error: 'Failed to delete lead' },
            { status: 500 }
        );
    }
}
