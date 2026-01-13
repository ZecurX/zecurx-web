import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { AdminJWTPayload, Role, ROLES } from '@/types/auth';
import { hasPermission } from '@/lib/permissions';
import { RESOURCES, ACTIONS } from '@/types/auth';

// Route to resource mapping for permission checks
const ROUTE_PERMISSIONS: Record<string, { resource: string; action: string }> = {
    '/admin/users': { resource: RESOURCES.USERS, action: ACTIONS.READ },
    '/admin/customers': { resource: RESOURCES.CUSTOMERS, action: ACTIONS.READ },
    '/admin/sales': { resource: RESOURCES.SALES, action: ACTIONS.READ },
    '/admin/plans': { resource: RESOURCES.PLANS, action: ACTIONS.READ },
    '/admin/products': { resource: RESOURCES.PRODUCTS, action: ACTIONS.READ },
    '/admin/audit': { resource: RESOURCES.AUDIT, action: ACTIONS.READ },
    '/admin/blog': { resource: RESOURCES.BLOG, action: ACTIONS.READ },
};

export async function proxy(request: NextRequest) {
    // Only run on /admin routes
    if (!request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    // Exclude login page from protection
    if (request.nextUrl.pathname === '/admin/login') {
        const session = request.cookies.get('admin_session');
        // If already logged in, redirect to dashboard
        if (session) {
            try {
                const secret = new TextEncoder().encode(process.env.ADMIN_PASSWORD);
                await jwtVerify(session.value, secret);
                return NextResponse.redirect(new URL('/admin', request.url));
            } catch {
                // Invalid token, allow access to login page
            }
        }
        return NextResponse.next();
    }

    // Protect other admin routes
    const session = request.cookies.get('admin_session');

    if (!session) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.ADMIN_PASSWORD);
        const { payload } = await jwtVerify(session.value, secret);
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
                    return NextResponse.redirect(new URL('/admin?access_denied=1', request.url));
                }
                break;
            }
        }

        return response;
    } catch {
        // Invalid or expired token
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
}

export const config = {
    matcher: ['/admin/:path*'],
};
