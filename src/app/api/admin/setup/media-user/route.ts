import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const authResult = await requirePermission('users', 'create', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const existingUser = await db.query(
      'SELECT id, email, role FROM admins WHERE email = $1',
      ['media@zecurx.com']
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json({
        error: 'Media user already exists',
        user: existingUser.rows[0],
      }, { status: 409 });
    }

    const password = 'media123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO admins (
        email,
        password_hash,
        role,
        name,
        is_active,
        created_by,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, email, role, name, is_active, created_at`,
      [
        'media@zecurx.com',
        hashedPassword,
        'media',
        'Media Team',
        true,
        authResult.session.sub,
      ]
    );

    const newUser = result.rows[0];

    return NextResponse.json({
      success: true,
      message: 'Media user created successfully',
      user: newUser,
      credentials: {
        email: 'media@zecurx.com',
        password: 'media123',
        warning: 'CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN',
      },
      permissions: {
        'blog:create': true,
        'blog:read': true,
        'blog:update': true,
        'blog:delete': true,
        'blog:publish': true,
        note: 'Media has full blog access (blog:*)',
      },
    });
  } catch (error: unknown) {
    console.error('Create media user error:', error);
    
    if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === '23505') {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    
    return NextResponse.json({
      error: 'Failed to create media user',
      details: error instanceof Error ? error.message : 'An error occurred',
    }, { status: 500 });
  }
}
