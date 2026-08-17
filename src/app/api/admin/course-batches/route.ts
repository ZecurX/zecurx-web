import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { RESOURCES, ACTIONS } from '@/types/auth';

interface CourseBatch {
    id: string;
    plan_id: string;
    name: string;
    start_date: string;
    end_date: string | null;
    capacity: number;
    seats_booked: number;
    status: string;
    created_at: string;
    course_name: string;
}

export async function GET(request: NextRequest) {
    const authResult = await requirePermission(RESOURCES.COURSE_BOOKINGS, ACTIONS.READ, request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { searchParams } = new URL(request.url);
        const planId = searchParams.get('planId');

        let sql = `
            SELECT cb.*, p.name as course_name
            FROM zecurx_admin.course_batches cb
            JOIN plans p ON p.id = cb.plan_id
        `;
        const params: string[] = [];
        if (planId) {
            sql += ` WHERE cb.plan_id = $1`;
            params.push(planId);
        }
        sql += ` ORDER BY cb.start_date DESC`;

        const result = await query<CourseBatch>(sql, params);

        return NextResponse.json({ batches: result.rows });
    } catch (error) {
        console.error('Failed to fetch course batches:', error);
        return NextResponse.json({ error: 'Failed to fetch course batches' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const authResult = await requirePermission(RESOURCES.COURSE_BOOKINGS, ACTIONS.CREATE, request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const body = await request.json();
        const { planId, name, startDate, endDate, capacity } = body;

        if (!planId || !name || !startDate || !capacity) {
            return NextResponse.json(
                { error: 'Missing required fields: planId, name, startDate, capacity' },
                { status: 400 }
            );
        }

        const result = await query<CourseBatch>(
            `INSERT INTO zecurx_admin.course_batches (plan_id, name, start_date, end_date, capacity)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [planId, name, startDate, endDate || null, capacity]
        );

        return NextResponse.json({ success: true, batch: result.rows[0] });
    } catch (error) {
        console.error('Failed to create course batch:', error);
        return NextResponse.json({ error: 'Failed to create course batch' }, { status: 500 });
    }
}
