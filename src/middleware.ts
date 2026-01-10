import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
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
            } catch (err) {
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
        await jwtVerify(session.value, secret);
        return NextResponse.next();
    } catch (err) {
        // Invalid or expired token
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
}

export const config = {
    matcher: ['/admin/:path*'],
};
