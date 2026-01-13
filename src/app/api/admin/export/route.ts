import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface ExportRow {
    name: string;
    email: string;
    phone: string;
    college: string;
    plan_name: string;
    plan_type: string;
    domain: string;
    amount: number;
    status: string;
    date: string;
}

function extractDomain(planName: string): string {
    const name = planName.toLowerCase();
    if (name.includes('penetration tester')) return 'Penetration Tester';
    if (name.includes('app developer')) return 'App Developer';
    if (name.includes('website developer')) return 'Website Developer';
    if (name.includes('cybersecurity ai')) return 'Cybersecurity AI Developer';
    return 'Other';
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const format = searchParams.get('format') || 'xlsx';
        const type = searchParams.get('type') || 'all';
        const domain = searchParams.get('domain') || 'all';

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        let query = supabase
            .from('transactions')
            .select(`
                amount,
                status,
                created_at,
                customers (
                    name,
                    email,
                    phone,
                    college
                ),
                plans (
                    name,
                    type
                )
            `)
            .order('created_at', { ascending: false });

        const { data: transactions, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let rows: ExportRow[] = (transactions || []).map((t: any) => {
            const customer = Array.isArray(t.customers) ? t.customers[0] : t.customers;
            const plan = Array.isArray(t.plans) ? t.plans[0] : t.plans;
            
            return {
                name: customer?.name || '',
                email: customer?.email || '',
                phone: customer?.phone || '',
                college: customer?.college || '',
                plan_name: plan?.name || '',
                plan_type: plan?.type || '',
                domain: extractDomain(plan?.name || ''),
                amount: t.amount,
                status: t.status,
                date: new Date(t.created_at).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })
            };
        });

        if (type === 'internship') {
            rows = rows.filter(r => r.plan_type === 'internship');
        }

        if (domain !== 'all') {
            rows = rows.filter(r => r.domain === domain);
        }

        if (format === 'xlsx') {
            const worksheetData = rows.map(r => ({
                'Name': r.name,
                'Email': r.email,
                'Phone': r.phone,
                'College': r.college,
                'Plan': r.plan_name,
                'Domain': r.domain,
                'Amount (₹)': r.amount,
                'Status': r.status,
                'Date': r.date
            }));

            const worksheet = XLSX.utils.json_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            
            const colWidths = [
                { wch: 25 },
                { wch: 30 },
                { wch: 15 },
                { wch: 30 },
                { wch: 40 },
                { wch: 20 },
                { wch: 12 },
                { wch: 10 },
                { wch: 15 }
            ];
            worksheet['!cols'] = colWidths;

            const sheetName = type === 'internship' ? 'Internship Enrollments' : 'All Customers';
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

            const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

            const filename = `zecurx-${type === 'internship' ? 'internships' : 'customers'}-${new Date().toISOString().split('T')[0]}.xlsx`;

            return new NextResponse(buffer, {
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': `attachment; filename="${filename}"`
                }
            });
        }

        if (format === 'csv') {
            const worksheet = XLSX.utils.json_to_sheet(rows.map(r => ({
                'Name': r.name,
                'Email': r.email,
                'Phone': r.phone,
                'College': r.college,
                'Plan': r.plan_name,
                'Domain': r.domain,
                'Amount': r.amount,
                'Status': r.status,
                'Date': r.date
            })));
            
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            const filename = `zecurx-${type === 'internship' ? 'internships' : 'customers'}-${new Date().toISOString().split('T')[0]}.csv`;

            return new NextResponse(csv, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="${filename}"`
                }
            });
        }

        return NextResponse.json({ error: 'Invalid format. Use xlsx or csv' }, { status: 400 });

    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({ error: 'Export failed' }, { status: 500 });
    }
}
