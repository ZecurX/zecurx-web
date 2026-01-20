import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { AdminJWTPayload, Role, RESOURCES, ACTIONS } from './src/types/auth';
import { hasPermission } from './src/lib/permissions';

const ROUTE_PERMISSIONS: Record<string, { resource: string; action: string }> = {
    '/admin/users': { resource: RESOURCES.USERS, action: ACTIONS.READ },
    '/admin/customers': { resource: RESOURCES.CUSTOMERS, action: ACTIONS.READ },
    '/admin/sales': { resource: RESOURCES.SALES, action: ACTIONS.READ },
    '/admin/plans': { resource: RESOURCES.PLANS, action: ACTIONS.READ },
    '/admin/products': { resource: RESOURCES.PRODUCTS, action: ACTIONS.READ },
    '/admin/audit': { resource: RESOURCES.AUDIT, action: ACTIONS.READ },
    '/admin/blog': { resource: RESOURCES.BLOG, action: ACTIONS.READ },
};

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
                // Invalid token - allow access to login
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
                const userRole = jwtPayload.role as Role;
                
                if (!hasPermission(userRole, permission.resource as any, permission.action as any)) {
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
