import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import * as XLSX from 'xlsx';

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

interface TransactionJoin {
    amount: number;
    status: string;
    created_at: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_college: string;
    plan_name: string;
    plan_type: string;
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

        const result = await query<TransactionJoin>(`
            SELECT 
                t.amount,
                t.status,
                t.created_at,
                c.name as customer_name,
                c.email as customer_email,
                c.phone as customer_phone,
                c.college as customer_college,
                p.name as plan_name,
                p.type as plan_type
            FROM transactions t
            LEFT JOIN customers c ON t.customer_id = c.id
            LEFT JOIN plans p ON t.plan_id = p.id
            ORDER BY t.created_at DESC
        `);

        let rows: ExportRow[] = result.rows.map((t) => ({
            name: t.customer_name || '',
            email: t.customer_email || '',
            phone: t.customer_phone || '',
            college: t.customer_college || '',
            plan_name: t.plan_name || '',
            plan_type: t.plan_type || '',
            domain: extractDomain(t.plan_name || ''),
            amount: t.amount,
            status: t.status,
            date: new Date(t.created_at).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        }));

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
