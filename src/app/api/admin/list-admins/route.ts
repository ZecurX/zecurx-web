import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const result = await query(`SELECT id, email, name, role, created_at FROM admins ORDER BY created_at DESC`);
        return NextResponse.json({ admins: result.rows });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 });
    }
}
