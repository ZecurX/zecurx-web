import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import { NextRequest } from 'next/server';
import { AdminJWTPayload, Role, Resource, Action, ROLES } from '@/types/auth';
import { hasPermission as checkPermission } from './permissions';

const JWT_EXPIRATION = '24h';

export function getJwtSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD;
    if (!secret) {
        throw new Error('JWT_SECRET or ADMIN_PASSWORD environment variable is required');
    }
    return new TextEncoder().encode(secret);
}

/**
 * Verify the admin session from cookies
 * Returns the JWT payload if valid, null otherwise
 */
export async function verifySession(tokenValue?: string): Promise<AdminJWTPayload | null> {
  try {
    let sessionValue: string | undefined = tokenValue;
    
    if (!sessionValue) {
      const cookieStore = await cookies();
      const session = cookieStore.get('admin_session');
      sessionValue = session?.value;
    }
    
    if (!sessionValue) {
      return null;
    }
    
    const { payload } = await jwtVerify(sessionValue, getJwtSecret());
    return payload as unknown as AdminJWTPayload;
  } catch {
    return null;
  }
}

/**
 * Verify session from a request object (for API routes)
 */
export async function verifySessionFromRequest(request: NextRequest): Promise<AdminJWTPayload | null> {
  try {
    const session = request.cookies.get('admin_session');
    
    if (!session?.value) {
      return null;
    }
    
    const { payload } = await jwtVerify(session.value, getJwtSecret());
    return payload as unknown as AdminJWTPayload;
  } catch {
    return null;
  }
}

/**
 * Create a new JWT token for an admin
 */
export async function createToken(admin: {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}): Promise<string> {
  const token = await new SignJWT({
    sub: admin.id,
    email: admin.email,
    name: admin.name || admin.email.split('@')[0],
    role: admin.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(getJwtSecret());
  
  return token;
}

/**
 * Set the admin session cookie
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
    sameSite: 'strict',
  });
}

/**
 * Clear the admin session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

/**
 * Check if the current session has a specific permission
 */
export async function hasSessionPermission(resource: Resource, action: Action): Promise<boolean> {
  const session = await verifySession();
  if (!session) {
    return false;
  }
  return checkPermission(session.role, resource, action);
}

/**
 * Require a specific role(s) for an API route
 * Returns the session if authorized, throws/returns error response if not
 */
export async function requireRole(
  allowedRoles: Role[],
  request?: NextRequest
): Promise<{ session: AdminJWTPayload; authorized: true } | { session: null; authorized: false; error: string }> {
  let session: AdminJWTPayload | null = null;
  
  if (request) {
    session = await verifySessionFromRequest(request);
  } else {
    session = await verifySession();
  }
  
  if (!session) {
    return { session: null, authorized: false, error: 'Unauthorized: No valid session' };
  }
  
  // Super admin always has access
  if (session.role === ROLES.SUPER_ADMIN) {
    return { session, authorized: true };
  }
  
  if (!allowedRoles.includes(session.role)) {
    return { session: null, authorized: false, error: 'Forbidden: Insufficient permissions' };
  }
  
  return { session, authorized: true };
}

/**
 * Require a specific permission for an API route
 */
export async function requirePermission(
  resource: Resource,
  action: Action,
  request?: NextRequest
): Promise<{ session: AdminJWTPayload; authorized: true } | { session: null; authorized: false; error: string; status: number }> {
  let session: AdminJWTPayload | null = null;
  
  if (request) {
    session = await verifySessionFromRequest(request);
  } else {
    session = await verifySession();
  }
  
  if (!session) {
    return { session: null, authorized: false, error: 'Unauthorized: No valid session', status: 401 };
  }
  
  if (!checkPermission(session.role, resource, action)) {
    return { session: null, authorized: false, error: 'Forbidden: Insufficient permissions', status: 403 };
  }
  
  return { session, authorized: true };
}

/**
 * Extract IP address from request
 */
export function getClientIP(request: NextRequest): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  return null;
}

/**
 * Extract user agent from request
 */
export function getUserAgent(request: NextRequest): string | null {
  return request.headers.get('user-agent');
}
