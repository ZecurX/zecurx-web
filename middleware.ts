import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

type Role = 'super_admin' | 'admin' | 'sales' | 'marketing' | 'media';

interface AdminJWTPayload {
    sub: string;
    email: string;
    name: string;
    role: Role;
    iat: number;
    exp: number;
}

const ROLE_PERMISSIONS: Record<Role, string[]> = {
    super_admin: ['*'],
    admin: ['dashboard:*', 'customers:*', 'sales:*', 'plans:*', 'products:*', 'leads:*', 'referral_codes:*', 'blog:read', 'whitepapers:*', 'settings:*'],
    sales: ['dashboard:*', 'customers:*', 'sales:*', 'products:*', 'leads:*', 'referral_codes:*'],
    marketing: ['plans:*', 'leads:read', 'whitepapers:*'],
    media: ['blog:*', 'whitepapers:*'],
};

const ROUTE_PERMISSIONS: Record<string, { resource: string; action: string }> = {
    '/admin/users': { resource: 'users', action: 'read' },
    '/admin/customers': { resource: 'customers', action: 'read' },
    '/admin/sales': { resource: 'sales', action: 'read' },
    '/admin/plans': { resource: 'plans', action: 'read' },
    '/admin/products': { resource: 'products', action: 'read' },
    '/admin/audit': { resource: 'audit', action: 'read' },
    '/admin/blog': { resource: 'blog', action: 'read' },
};

function hasPermission(role: Role, resource: string, action: string): boolean {
    const permissions = ROLE_PERMISSIONS[role];
    if (permissions.includes('*')) return true;
    if (permissions.includes(`${resource}:${action}`)) return true;
    if (permissions.includes(`${resource}:*`)) return true;
    return false;
}

function getJwtSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD;
    if (!secret) {
        throw new Error('JWT_SECRET or ADMIN_PASSWORD environment variable is required');
    }
    return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
    if (!request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    if (request.nextUrl.pathname === '/admin/login') {
        const session = request.cookies.get('admin_session');
        if (session) {
            try {
                await jwtVerify(session.value, getJwtSecret());
                return NextResponse.redirect(new URL('/admin', request.url));
            } catch {
                // Invalid token - allow login page access
            }
        }
        return NextResponse.next();
    }

    const session = request.cookies.get('admin_session');

    if (!session) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
        const { payload } = await jwtVerify(session.value, getJwtSecret());
        const jwtPayload = payload as unknown as AdminJWTPayload;

        const response = NextResponse.next();
        response.headers.set('x-user-id', jwtPayload.sub);
        response.headers.set('x-user-email', jwtPayload.email);
        response.headers.set('x-user-role', jwtPayload.role);
        response.headers.set('x-user-name', jwtPayload.name || '');

        const pathname = request.nextUrl.pathname;
        
        for (const [route, permission] of Object.entries(ROUTE_PERMISSIONS)) {
            if (pathname === route || pathname.startsWith(`${route}/`)) {
                if (!hasPermission(jwtPayload.role, permission.resource, permission.action)) {
                    return NextResponse.redirect(new URL('/admin?access_denied=1', request.url));
                }
                break;
            }
        }

        return response;
    } catch {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
}

export const config = {
    matcher: ['/admin/:path*'],
};
