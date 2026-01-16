import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST() {
    const startTime = Date.now();

    try {
        const versionResult = await query('SELECT version()');
        const version = versionResult.rows[0]?.version || 'Unknown';

        const tablesResult = await query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'zecurx_admin' 
            ORDER BY table_name
        `);
        const tables = tablesResult.rows.map((r) => r.table_name);

        const countResults: Record<string, number> = {};
        for (const table of tables.slice(0, 5)) {
            const countResult = await query(`SELECT COUNT(*) as count FROM ${table}`);
            countResults[table] = parseInt(countResult.rows[0]?.count || '0');
        }

        const duration = Date.now() - startTime;

        return NextResponse.json({
            success: true,
            message: 'Database connection successful',
            details: {
                version: version.split(',')[0],
                schema: 'zecurx_admin',
                tables: tables.length,
                tableList: tables,
                sampleCounts: countResults,
                responseTime: `${duration}ms`,
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Database connection failed',
            },
            { status: 500 }
        );
    }
}
