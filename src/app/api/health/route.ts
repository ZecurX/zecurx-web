import { NextResponse } from 'next/server';
import { isRateLimitingEnabled, validateProductionConfig } from '@/lib/rate-limit';
import { query } from '@/lib/db';

// Force dynamic rendering - don't prerender during build
export const dynamic = 'force-dynamic';

interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    checks: {
        database: 'ok' | 'error';
        redis: 'ok' | 'unavailable';
    };
    version?: string;
}

export async function GET(): Promise<NextResponse<HealthStatus>> {
    // Validate production config at runtime (not during build)
    validateProductionConfig();
    let databaseStatus: 'ok' | 'error' = 'error';
    const redisStatus: 'ok' | 'unavailable' = isRateLimitingEnabled() ? 'ok' : 'unavailable';

    // Check database connectivity
    try {
        await query('SELECT 1');
        databaseStatus = 'ok';
    } catch {
        databaseStatus = 'error';
    }

    const checks = {
        database: databaseStatus,
        redis: redisStatus,
    };

    // Determine overall status
    const allOk = databaseStatus === 'ok' && redisStatus === 'ok';
    const anyError = databaseStatus === 'error';

    let status: HealthStatus['status'];
    let httpStatus: number;

    if (anyError) {
        status = 'unhealthy';
        httpStatus = 503;
    } else if (!allOk) {
        status = 'degraded';
        httpStatus = 200;
    } else {
        status = 'healthy';
        httpStatus = 200;
    }

    const response: HealthStatus = {
        status,
        timestamp: new Date().toISOString(),
        checks,
        version: process.env.npm_package_version,
    };

    return NextResponse.json(response, { status: httpStatus });
}
