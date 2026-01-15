import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { StudentLead, LEAD_STATUS, LEAD_PRIORITY } from '@/types/lead-types';

export const dynamic = 'force-dynamic';

// GET - List student leads with filters, pagination, search
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Query parameters
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');
        const assignedTo = searchParams.get('assignedTo');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        let query = supabase
            .from('student_leads')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

        // Apply filters
        if (status) query = query.eq('status', status);
        if (priority) query = query.eq('priority', priority);
        if (assignedTo) query = query.eq('assigned_to', assignedTo);
        if (search) {
            query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
        }

        // Pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;

        return NextResponse.json({
            data: data as StudentLead[],
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
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

// POST - Create student lead (public form submission)
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        const requiredFields = ['full_name', 'email', 'phone', 'current_education', 'field_of_interest'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Get client info from headers
        const ip_address = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
        const user_agent = request.headers.get('user-agent') || null;

        // Insert lead
        const { data, error } = await supabase
            .from('student_leads')
            .insert({
                full_name: body.full_name,
                email: body.email,
                phone: body.phone,
                alternate_phone: body.alternate_phone || null,
                date_of_birth: body.date_of_birth || null,
                current_education: body.current_education,
                field_of_interest: body.field_of_interest,
                preferred_course: body.preferred_course || null,
                intake_year: body.intake_year || null,
                intake_season: body.intake_season || null,
                lead_source: body.lead_source || 'Website Form',
                source_page: body.source_page || request.headers.get('referer') || 'Unknown',
                enquiry_type: body.enquiry_type || 'Student Enquiry',
                message: body.message || null,
                status: LEAD_STATUS.NEW,
                priority: LEAD_PRIORITY.MEDIUM,
                ip_address,
                user_agent,
            })
            .select()
            .single();

        if (error) throw error;

        // Log activity
        await supabase.from('student_lead_activities').insert({
            lead_id: data.id,
            activity_type: 'LEAD_CREATED',
            description: `Lead created from ${body.lead_source || 'Website Form'}`,
        });

        // TODO: Send welcome email (SMTP to be implemented by friend)
        // await sendWelcomeEmail(data);

        return NextResponse.json({
            success: true,
            data,
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
