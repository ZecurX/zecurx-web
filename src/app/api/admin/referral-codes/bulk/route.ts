import { NextRequest, NextResponse } from 'next/server';
import { db, query } from '@/lib/db';
import { requirePermission, getClientIP, getUserAgent } from '@/lib/auth';
import { logCRUD } from '@/lib/audit';
import {
  ReferralCode,
  CreateReferralCodeRequest,
} from '@/types/referral-types';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function randomSegment(chars: string, length: number): string {
  let s = '';
  for (let i = 0; i < length; i++) {
    s += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return s;
}

// Format: ZX-{MIDDLE}-{6-char suffix}
// MIDDLE = user prefix (if provided) or 2 random alpha chars
function buildCode(prefix: string): string {
  const middle = prefix || randomSegment(ALPHA, 2);
  const suffix = randomSegment(CHARS, 6);
  return `ZX-${middle}-${suffix}`;
}

async function generateUniqueCode(
  prefix: string,
  existingInBatch: Set<string>,
): Promise<string | null> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = buildCode(prefix);

    if (existingInBatch.has(code)) continue;

    const existing = await query(
      `SELECT id FROM public.referral_codes WHERE code = $1`,
      [code],
    );
    if (existing.rows.length === 0) return code;
  }
  return null;
}

// POST /api/admin/referral-codes/bulk — generate N unique codes
export async function POST(req: NextRequest) {
  const authResult = await requirePermission('referral_codes', 'create', req);
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  const { session } = authResult;

  try {
    const body: CreateReferralCodeRequest & {
      count?: number;
      prefix?: string;
    } = await req.json();

    const count = Math.min(Math.max(parseInt(String(body.count ?? 1)), 1), 10);
    const prefix = body.prefix ? body.prefix.toUpperCase().trim() : '';

    if (!body.discount_type || !body.discount_value) {
      return NextResponse.json(
        { error: 'Discount type and value are required' },
        { status: 400 },
      );
    }
    if (!['percentage', 'fixed'].includes(body.discount_type)) {
      return NextResponse.json(
        { error: "Discount type must be 'percentage' or 'fixed'" },
        { status: 400 },
      );
    }
    if (body.discount_value <= 0) {
      return NextResponse.json(
        { error: 'Discount value must be greater than 0' },
        { status: 400 },
      );
    }
    if (body.discount_type === 'percentage' && body.discount_value > 100) {
      return NextResponse.json(
        { error: 'Percentage discount cannot exceed 100%' },
        { status: 400 },
      );
    }

    const generatedInBatch = new Set<string>();
    const created: ReferralCode[] = [];

    for (let i = 0; i < count; i++) {
      const code = await generateUniqueCode(prefix, generatedInBatch);
      if (!code) {
        return NextResponse.json(
          {
            error: `Failed to generate a unique code for slot ${i + 1}. Try a different prefix.`,
          },
          { status: 500 },
        );
      }
      generatedInBatch.add(code);

      const result = await db.query<ReferralCode>(
        `INSERT INTO public.referral_codes (
                    code, discount_type, discount_value, min_order_amount,
                    max_discount, max_uses, valid_from, valid_until, is_active, created_by
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *`,
        [
          code,
          body.discount_type,
          body.discount_value,
          body.min_order_amount || 0,
          body.max_discount || null,
          body.max_uses || null,
          body.valid_from || new Date().toISOString(),
          body.valid_until || null,
          body.is_active !== false,
          session.sub,
        ],
      );

      created.push(result.rows[0]);
    }

    const ipAddress = getClientIP(req);
    const userAgent = getUserAgent(req);
    await logCRUD(
      { id: session.sub, email: session.email, role: session.role },
      'create',
      'referral_codes',
      'bulk',
      {
        count,
        prefix,
        discount_type: body.discount_type,
        discount_value: body.discount_value,
        codes: created.map((c) => c.code),
      },
      ipAddress,
      userAgent,
    );

    return NextResponse.json({ codes: created });
  } catch (error) {
    console.error('Bulk Generate Referral Codes Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/referral-codes/bulk — delete selected codes
export async function DELETE(req: NextRequest) {
  const authResult = await requirePermission('referral_codes', 'delete', req);
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  const { session } = authResult;

  try {
    const body: { ids: string[] } = await req.json();

    if (!Array.isArray(body.ids) || body.ids.length === 0) {
      return NextResponse.json(
        { error: 'ids array is required' },
        { status: 400 },
      );
    }
    if (body.ids.length > 100) {
      return NextResponse.json(
        { error: 'Cannot delete more than 100 codes at once' },
        { status: 400 },
      );
    }

    // Fetch codes before deletion for audit log
    const existing = await query<{ id: string; code: string }>(
      `SELECT id, code FROM public.referral_codes WHERE id = ANY($1::uuid[])`,
      [body.ids],
    );
    const codes = existing.rows.map((r) => r.code);

    const result = await db.query(
      `DELETE FROM public.referral_codes WHERE id = ANY($1::uuid[])`,
      [body.ids],
    );

    const deleted = result.rowCount ?? 0;

    const ipAddress = getClientIP(req);
    const userAgent = getUserAgent(req);
    await logCRUD(
      { id: session.sub, email: session.email, role: session.role },
      'delete',
      'referral_codes',
      'bulk',
      { deleted, codes },
      ipAddress,
      userAgent,
    );

    return NextResponse.json({ deleted });
  } catch (error) {
    console.error('Bulk Delete Referral Codes Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

// PATCH /api/admin/referral-codes/bulk — bulk activate or deactivate
export async function PATCH(req: NextRequest) {
  const authResult = await requirePermission('referral_codes', 'update', req);
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  const { session } = authResult;

  try {
    const body: { ids: string[]; is_active: boolean } = await req.json();

    if (!Array.isArray(body.ids) || body.ids.length === 0) {
      return NextResponse.json(
        { error: 'ids array is required' },
        { status: 400 },
      );
    }
    if (typeof body.is_active !== 'boolean') {
      return NextResponse.json(
        { error: 'is_active (boolean) is required' },
        { status: 400 },
      );
    }
    if (body.ids.length > 100) {
      return NextResponse.json(
        { error: 'Cannot update more than 100 codes at once' },
        { status: 400 },
      );
    }

    const result = await db.query(
      `UPDATE public.referral_codes SET is_active = $1 WHERE id = ANY($2::uuid[])`,
      [body.is_active, body.ids],
    );

    const updated = result.rowCount ?? 0;

    const ipAddress = getClientIP(req);
    const userAgent = getUserAgent(req);
    await logCRUD(
      { id: session.sub, email: session.email, role: session.role },
      'update',
      'referral_codes',
      'bulk',
      { updated, is_active: body.is_active, ids: body.ids },
      ipAddress,
      userAgent,
    );

    return NextResponse.json({ updated });
  } catch (error) {
    console.error('Bulk Update Referral Codes Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
