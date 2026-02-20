import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import * as argon2 from 'argon2';
import { query } from '@/lib/db';
import {
  createToken,
  setSessionCookie,
  getClientIP,
  getUserAgent,
} from '@/lib/auth';
import { logLogin } from '@/lib/audit';
import { Role } from '@/types/auth';

async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  if (hash.startsWith('$argon2')) {
    return argon2.verify(hash, password);
  }
  return compare(password, hash);
}

const SUPER_USERS = [
  'zecurxintern@gmail.com',
  'mohitsen.official16@gmail.com',
  'hrshpriyam@gmail.com',
  'alkakumari1976@gmail.com',
];

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const isSuperUser = SUPER_USERS.includes(email);

    if (isSuperUser) {
      // Super User Flow: Uses OTP
      const result = await query(
        'SELECT id, email, name, is_active FROM admins WHERE email = $1 LIMIT 1',
        [email],
      );
      const admin = result.rows[0];

      if (!admin) {
        return NextResponse.json({ error: 'Access Denied' }, { status: 403 });
      }

      if (!admin.is_active) {
        return NextResponse.json(
          { error: 'Account is deactivated' },
          { status: 401 },
        );
      }

      // Generate and send OTP
      const { createOtp, sendOtpEmail } = await import('@/lib/otp');

      const otp = await createOtp(email, 'admin_login');
      await sendOtpEmail(email, otp, 'admin_login', 'Admin Portal');

      return NextResponse.json({
        success: true,
        otpRequired: true,
        email: email,
      });
    }

    // Normal User Flow: Uses Password
    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const result = await query(
      'SELECT id, email, password_hash, role, name, is_active FROM admins WHERE email = $1 LIMIT 1',
      [email],
    );

    const admin = result.rows[0];

    if (!admin || !admin.is_active) {
      // Return generic error for security or explicit if deactivated
      return NextResponse.json(
        {
          error:
            admin && !admin.is_active
              ? 'Account is deactivated'
              : 'Invalid credentials',
        },
        { status: 401 },
      );
    }

    const isValid = await verifyPassword(password, admin.password_hash);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // Enforce Role Restrictions
    let assignedRole = admin.role as Role;
    if (assignedRole === 'super_admin') {
      assignedRole = 'admin'; // Demote if not in allowed list
    }

    const token = await createToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: assignedRole,
    });

    await setSessionCookie(token);

    const ipAddress = getClientIP(req);
    const userAgent = getUserAgent(req);
    await logLogin(
      { id: admin.id, email: admin.email, role: assignedRole },
      ipAddress,
      userAgent,
    );

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: assignedRole,
      },
    });
  } catch (error: any) {
    console.error('Auth Error:', error);
    const isConnectionError =
      error?.message?.includes('timeout') ||
      error?.message?.includes('ETIMEDOUT') ||
      error?.message?.includes('Connection terminated');
    if (isConnectionError) {
      return NextResponse.json(
        {
          error:
            'Service temporarily unavailable. Database connection failed — please try again later.',
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      {
        error: 'Internal Error',
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { verifySession } = await import('@/lib/auth');
    const session = await verifySession();

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: session.sub,
        email: session.email,
        name: session.name,
        role: session.role,
      },
    });
  } catch (error) {
    console.error('Session Error:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
