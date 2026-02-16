import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { StudentLead, LEAD_STATUS, LEAD_PRIORITY } from '@/types/lead-types';
import { checkLeadsRateLimit, getClientIp } from '@/lib/rate-limit';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const status = searchParams.get('status');
        const priority = searchParams.get('priority');
        const assignedTo = searchParams.get('assignedTo');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const conditions: string[] = [];
        const values: unknown[] = [];
        let paramIndex = 1;

        if (status) {
            conditions.push(`status = $${paramIndex++}`);
            values.push(status);
        }
        if (priority) {
            conditions.push(`priority = $${paramIndex++}`);
            values.push(priority);
        }
        if (assignedTo) {
            conditions.push(`assigned_to = $${paramIndex++}`);
            values.push(assignedTo);
        }
        if (search) {
            conditions.push(`(full_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR phone ILIKE $${paramIndex})`);
            values.push(`%${search}%`);
            paramIndex++;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const offset = (page - 1) * limit;

        const countResult = await query(
            `SELECT COUNT(*) as count FROM student_leads ${whereClause}`,
            values
        );
        const total = parseInt(countResult.rows[0]?.count || '0');

        const dataResult = await query<StudentLead>(
            `SELECT * FROM student_leads ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
            [...values, limit, offset]
        );

        return NextResponse.json({
            data: dataResult.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching student leads:', error);
        return NextResponse.json(
            { error: 'Failed to fetch leads' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const ip = getClientIp(request);
        const rateLimitResult = await checkLeadsRateLimit(ip);
        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        const body = await request.json();

        const requiredFields = ['full_name', 'email', 'phone', 'current_education', 'field_of_interest'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        const ip_address = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
        const user_agent = request.headers.get('user-agent') || null;

        const result = await query<StudentLead>(
            `INSERT INTO student_leads (
                full_name, email, phone, alternate_phone, date_of_birth,
                current_education, field_of_interest, preferred_course,
                intake_year, intake_season, lead_source, source_page,
                enquiry_type, message, status, priority, ip_address, user_agent
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            RETURNING *`,
            [
                body.full_name,
                body.email,
                body.phone,
                body.alternate_phone || null,
                body.date_of_birth || null,
                body.current_education,
                body.field_of_interest,
                body.preferred_course || null,
                body.intake_year || null,
                body.intake_season || null,
                body.lead_source || 'Website Form',
                body.source_page || request.headers.get('referer') || 'Unknown',
                body.enquiry_type || 'Student Enquiry',
                body.message || null,
                LEAD_STATUS.NEW,
                LEAD_PRIORITY.MEDIUM,
                ip_address,
                user_agent,
            ]
        );

        const lead = result.rows[0];

        await query(
            `INSERT INTO student_lead_activities (lead_id, activity_type, description)
             VALUES ($1, $2, $3)`,
            [lead.id, 'LEAD_CREATED', `Lead created from ${body.lead_source || 'Website Form'}`]
        );

        return NextResponse.json({
            success: true,
            data: lead,
            message: 'Thank you for your enquiry! We will contact you within 24 hours.'
        });
    } catch (error) {
        console.error('Error creating student lead:', error);
        return NextResponse.json(
            { error: 'Failed to create lead' },
            { status: 500 }
        );
    }
}
