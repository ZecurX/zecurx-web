import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { RESOURCES, ACTIONS } from '@/types/auth';

interface Setting {
    key: string;
    value: boolean | string | number | object;
    description: string | null;
    updated_at: string;
}

export async function GET(request: NextRequest) {
    const authResult = await requirePermission(RESOURCES.SETTINGS, ACTIONS.READ, request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');

        if (key) {
            const result = await query<Setting>(
                'SELECT key, value, description, updated_at FROM zecurx_admin.settings WHERE key = $1',
                [key]
            );

            if (result.rows.length === 0) {
                return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
            }

            return NextResponse.json(result.rows[0]);
        }

        const result = await query<Setting>(
            'SELECT key, value, description, updated_at FROM zecurx_admin.settings ORDER BY key'
        );

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Settings GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const authResult = await requirePermission(RESOURCES.SETTINGS, ACTIONS.UPDATE, request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const body = await request.json();
        const { key, value } = body;

        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 });
        }

        const result = await query<Setting>(
            `UPDATE zecurx_admin.settings 
             SET value = $1, updated_at = NOW() 
             WHERE key = $2 
             RETURNING key, value, description, updated_at`,
            [JSON.stringify(value), key]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            setting: result.rows[0]
        });
    } catch (error) {
        console.error('Settings PUT error:', error);
        return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
    }
}
