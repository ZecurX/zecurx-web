import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { AdminJWTPayload, Role, ROLES } from '@/types/auth';
import { hasPermission } from '@/lib/permissions';
import { RESOURCES, ACTIONS } from '@/types/auth';
import { getJwtSecret } from '@/lib/auth';

// Route to resource mapping for permission checks
const ROUTE_PERMISSIONS: Record<string, { resource: string; action: string }> = {
    '/zx-ctrl-6fdbff/users': { resource: RESOURCES.USERS, action: ACTIONS.READ },
    '/zx-ctrl-6fdbff/customers': { resource: RESOURCES.CUSTOMERS, action: ACTIONS.READ },
    '/zx-ctrl-6fdbff/sales': { resource: RESOURCES.SALES, action: ACTIONS.READ },
    '/zx-ctrl-6fdbff/plans': { resource: RESOURCES.PLANS, action: ACTIONS.READ },
    '/zx-ctrl-6fdbff/products': { resource: RESOURCES.PRODUCTS, action: ACTIONS.READ },
    '/zx-ctrl-6fdbff/audit': { resource: RESOURCES.AUDIT, action: ACTIONS.READ },
    '/zx-ctrl-6fdbff/blog': { resource: RESOURCES.BLOG, action: ACTIONS.READ },
};

export async function proxy(request: NextRequest) {
    // Only run on admin routes (obscured path)
    if (!request.nextUrl.pathname.startsWith('/zx-ctrl-6fdbff')) {
        return NextResponse.next();
    }

    // Exclude login page from protection
    if (request.nextUrl.pathname === '/zx-ctrl-6fdbff/login') {
        const session = request.cookies.get('admin_session');
        // If already logged in, redirect to dashboard
        if (session) {
            try {
                await jwtVerify(session.value, getJwtSecret());
                return NextResponse.redirect(new URL('/zx-ctrl-6fdbff', request.url));
            } catch {
                // Invalid token, allow access to login page
            }
        }
        return NextResponse.next();
    }

    // Protect other admin routes
    const session = request.cookies.get('admin_session');

    if (!session) {
        return NextResponse.redirect(new URL('/zx-ctrl-6fdbff/login', request.url));
    }

    try {
        const { payload } = await jwtVerify(session.value, getJwtSecret());
        const jwtPayload = payload as unknown as AdminJWTPayload;

        // Add user info to request headers for use in pages/API routes
        const response = NextResponse.next();
        response.headers.set('x-user-id', jwtPayload.sub);
        response.headers.set('x-user-email', jwtPayload.email);
        response.headers.set('x-user-role', jwtPayload.role);
        response.headers.set('x-user-name', jwtPayload.name || '');

        // Check route-level permissions
        const pathname = request.nextUrl.pathname;
        
        // Find matching route permission
        for (const [route, permission] of Object.entries(ROUTE_PERMISSIONS)) {
            if (pathname === route || pathname.startsWith(`${route}/`)) {
                const userRole = jwtPayload.role as Role;
                
                if (!hasPermission(userRole, permission.resource as any, permission.action as any)) {
                    // Redirect to dashboard with access denied
                    return NextResponse.redirect(new URL('/zx-ctrl-6fdbff?access_denied=1', request.url));
                }
                break;
            }
        }

        return response;
    } catch {
        // Invalid or expired token
        return NextResponse.redirect(new URL('/zx-ctrl-6fdbff/login', request.url));
    }
}

export const config = {
    matcher: ['/zx-ctrl-6fdbff/:path*'],
};
