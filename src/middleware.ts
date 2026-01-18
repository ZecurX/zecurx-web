import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { proxy } from './proxy';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    
    if (pathname.startsWith('/admin')) {
        return new NextResponse(null, { status: 404 });
    }
    
    if (pathname.startsWith('/zx-ctrl-6fdbff')) {
        return proxy(request);
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/zx-ctrl-6fdbff/:path*'],
};
