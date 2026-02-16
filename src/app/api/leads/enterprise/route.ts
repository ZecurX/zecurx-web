import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { EnterpriseLead, LEAD_STATUS, LEAD_PRIORITY } from '@/types/lead-types';
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
            conditions.push(`(contact_person_name ILIKE $${paramIndex} OR company_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR phone ILIKE $${paramIndex})`);
            values.push(`%${search}%`);
            paramIndex++;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const offset = (page - 1) * limit;

        const countResult = await query(
            `SELECT COUNT(*) as count FROM enterprise_leads ${whereClause}`,
            values
        );
        const total = parseInt(countResult.rows[0]?.count || '0');

        const dataResult = await query<EnterpriseLead>(
            `SELECT * FROM enterprise_leads ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
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
        console.error('Error fetching enterprise leads:', error);
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

        const requiredFields = ['contact_person_name', 'email', 'phone', 'company_name', 'company_size', 'industry', 'designation', 'service_type'];
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

        const result = await query<EnterpriseLead>(
            `INSERT INTO enterprise_leads (
                contact_person_name, email, phone, alternate_phone,
                company_name, company_website, company_size, industry, designation,
                service_type, budget_range, team_size, start_date, urgency,
                lead_source, source_page, enquiry_type, requirements,
                status, priority, ip_address, user_agent
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
            RETURNING *`,
            [
                body.contact_person_name,
                body.email,
                body.phone,
                body.alternate_phone || null,
                body.company_name,
                body.company_website || null,
                body.company_size,
                body.industry,
                body.designation,
                body.service_type,
                body.budget_range || null,
                body.team_size || null,
                body.start_date || null,
                body.urgency || 'MEDIUM',
                body.lead_source || 'Website Form',
                body.source_page || request.headers.get('referer') || 'Unknown',
                body.enquiry_type || 'Enterprise Enquiry',
                body.requirements || null,
                LEAD_STATUS.NEW,
                LEAD_PRIORITY.MEDIUM,
                ip_address,
                user_agent,
            ]
        );

        const lead = result.rows[0];

        await query(
            `INSERT INTO enterprise_lead_activities (lead_id, activity_type, description)
             VALUES ($1, $2, $3)`,
            [lead.id, 'LEAD_CREATED', `Lead created from ${body.lead_source || 'Website Form'}`]
        );

        return NextResponse.json({
            success: true,
            data: lead,
            message: 'Thank you for your enquiry! Our enterprise team will contact you within 24 hours.'
        });
    } catch (error) {
        console.error('Error creating enterprise lead:', error);
        return NextResponse.json(
            { error: 'Failed to create lead' },
            { status: 500 }
        );
    }
}
