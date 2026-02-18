import { NextRequest, NextResponse } from 'next/server';
import { checkToolsRateLimit, getClientIp } from '@/lib/rate-limit';

const API_URL = process.env.ZECURX_API_URL || 'https://zecurx-tool-backend.onrender.com';
const API_KEY = process.env.ZECURX_API_KEY;

export async function POST(request: NextRequest) {
    try {
        const ip = getClientIp(request);
        const rateLimitResult = await checkToolsRateLimit(ip);
        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { tool, ...params } = body;

        if (!tool) {
            return NextResponse.json({ error: 'Tool type is required' }, { status: 400 });
        }

        const toolEndpoints: Record<string, string> = {
            'subdomain': '/api/tools/subdomain-scan',
            'directory': '/api/tools/directory-scan',
            'port': '/api/tools/port-scan',
            'tls': '/api/tools/tls-scan',
            'param': '/api/tools/param-scan',
            'header': '/api/tools/header-scan',
        };

        const endpoint = toolEndpoints[tool];
        if (!endpoint) {
            return NextResponse.json({ error: 'Invalid tool type' }, { status: 400 });
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(API_KEY && { 'X-API-Key': API_KEY }),
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || data.message || 'Scan failed' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Tool API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
