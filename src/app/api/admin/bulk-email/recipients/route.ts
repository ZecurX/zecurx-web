import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { query } from '@/lib/db';
import { RESOURCES, ACTIONS } from '@/types/auth';

type Recipient = { email: string; name: string; source: string };

function dedupe(list: Recipient[]): Recipient[] {
    const seen = new Set<string>();
    return list.filter(r => {
        const key = r.email.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

export async function GET(req: NextRequest) {
    const auth = await requirePermission(RESOURCES.BULK_EMAIL, ACTIONS.READ, req);
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        const audienceTypes = req.nextUrl.searchParams.get('audience_types')?.split(',').filter(Boolean) ?? [];
        const search = req.nextUrl.searchParams.get('search')?.trim() ?? '';

        // ── Search mode: find specific recipients across all tables ──
        if (search) {
            const term = `%${search}%`;
            const [studentRes, enterpriseRes, usersRes] = await Promise.all([
                query<Recipient>(
                    `SELECT DISTINCT email, full_name AS name, 'student_lead' AS source
                     FROM student_leads
                     WHERE email IS NOT NULL AND email <> ''
                       AND (full_name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1)
                     LIMIT 20`,
                    [term]
                ),
                query<Recipient>(
                    `SELECT DISTINCT email, contact_person_name AS name, 'enterprise_lead' AS source
                     FROM enterprise_leads
                     WHERE email IS NOT NULL AND email <> ''
                       AND (contact_person_name ILIKE $1 OR company_name ILIKE $1 OR email ILIKE $1)
                     LIMIT 20`,
                    [term]
                ),
                query<Recipient>(
                    `SELECT DISTINCT email, name, 'enrolled_student' AS source
                     FROM public.users
                     WHERE email IS NOT NULL AND email <> ''
                       AND (name ILIKE $1 OR email ILIKE $1)
                     LIMIT 20`,
                    [term]
                ),
            ]);

            const results = dedupe([
                ...studentRes.rows,
                ...enterpriseRes.rows,
                ...usersRes.rows,
            ]).slice(0, 30);

            return NextResponse.json({ count: results.length, recipients: results });
        }

        // ── Audience mode: count + preview for selected groups ──
        if (audienceTypes.length === 0) {
            return NextResponse.json({ count: 0, recipients: [] });
        }

        // Run all selected audience queries in parallel — avoids sequential timeout
        const [studentRes, enterpriseRes, usersRes] = await Promise.all([
            audienceTypes.includes('student_leads')
                ? query<Recipient>(
                    `SELECT DISTINCT email, full_name AS name, 'student_lead' AS source
                     FROM student_leads
                     WHERE email IS NOT NULL AND email <> ''`)
                : Promise.resolve({ rows: [] as Recipient[] }),

            audienceTypes.includes('enterprise_leads')
                ? query<Recipient>(
                    `SELECT DISTINCT email, contact_person_name AS name, 'enterprise_lead' AS source
                     FROM enterprise_leads
                     WHERE email IS NOT NULL AND email <> ''`)
                : Promise.resolve({ rows: [] as Recipient[] }),

            audienceTypes.includes('enrolled_students')
                ? query<Recipient>(
                    `SELECT DISTINCT email, name, 'enrolled_student' AS source
                     FROM public.users
                     WHERE email IS NOT NULL AND email <> ''`)
                : Promise.resolve({ rows: [] as Recipient[] }),
        ]);

        const unique = dedupe([
            ...studentRes.rows,
            ...enterpriseRes.rows,
            ...usersRes.rows,
        ]);

        const all = req.nextUrl.searchParams.get('all') === 'true';
        return NextResponse.json({ count: unique.length, recipients: all ? unique : unique.slice(0, 50) });
    } catch (error) {
        console.error('Error fetching bulk email recipients:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
