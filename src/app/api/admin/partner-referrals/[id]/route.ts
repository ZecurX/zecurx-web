import { NextRequest, NextResponse } from "next/server";
import { db, query } from "@/lib/db";
import { requirePermission, getClientIP, getUserAgent } from "@/lib/auth";
import { logCRUD } from "@/lib/audit";
import { PartnerReferral, UpdatePartnerReferralRequest } from "@/types/partner-referral-types";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requirePermission('referral_codes', 'read', req);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id } = await params;

        const result = await query(`
            SELECT 
                pr.*,
                COUNT(pru.id) as usage_count,
                COALESCE(SUM(pru.original_amount), 0) as total_revenue_generated
            FROM public.partner_referrals pr
            LEFT JOIN public.partner_referral_usages pru ON pr.id = pru.partner_referral_id
            WHERE pr.id = $1
            GROUP BY pr.id
        `, [id]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Partner referral not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Get Partner Referral Error:", error);
        return NextResponse.json({ error: "Failed to fetch partner referral" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requirePermission('referral_codes', 'update', req);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { session } = authResult;

    try {
        const { id } = await params;
        const body: UpdatePartnerReferralRequest = await req.json();

        const updates: string[] = [];
        const values: unknown[] = [];
        let paramIndex = 1;

        if (body.partner_name !== undefined) {
            updates.push(`partner_name = $${paramIndex++}`);
            values.push(body.partner_name.trim());
        }

        if (body.partner_email !== undefined) {
            updates.push(`partner_email = $${paramIndex++}`);
            values.push(body.partner_email.trim().toLowerCase());
        }

        if (body.partner_phone !== undefined) {
            updates.push(`partner_phone = $${paramIndex++}`);
            values.push(body.partner_phone?.trim() || null);
        }

        if (body.partner_notes !== undefined) {
            updates.push(`partner_notes = $${paramIndex++}`);
            values.push(body.partner_notes?.trim() || null);
        }

        if (body.code !== undefined) {
            const existingPartner = await query(
                `SELECT id FROM public.partner_referrals WHERE code = $1 AND id != $2`,
                [body.code.toUpperCase().trim(), id]
            );
            const existingRegular = await query(
                `SELECT id FROM public.referral_codes WHERE code = $1`,
                [body.code.toUpperCase().trim()]
            );
            if (existingPartner.rows.length > 0 || existingRegular.rows.length > 0) {
                return NextResponse.json(
                    { error: "A referral code with this code already exists" },
                    { status: 409 }
                );
            }
            updates.push(`code = $${paramIndex++}`);
            values.push(body.code.toUpperCase().trim());
        }

        if (body.user_discount_type !== undefined) {
            if (!['percentage', 'fixed'].includes(body.user_discount_type)) {
                return NextResponse.json(
                    { error: "User discount type must be 'percentage' or 'fixed'" },
                    { status: 400 }
                );
            }
            updates.push(`user_discount_type = $${paramIndex++}`);
            values.push(body.user_discount_type);
        }

        if (body.user_discount_value !== undefined) {
            if (body.user_discount_value < 0) {
                return NextResponse.json(
                    { error: "User discount value must be 0 or greater" },
                    { status: 400 }
                );
            }
            updates.push(`user_discount_value = $${paramIndex++}`);
            values.push(body.user_discount_value);
        }

        if (body.max_user_discount !== undefined) {
            updates.push(`max_user_discount = $${paramIndex++}`);
            values.push(body.max_user_discount);
        }

        if (body.min_order_amount !== undefined) {
            updates.push(`min_order_amount = $${paramIndex++}`);
            values.push(body.min_order_amount);
        }

        if (body.commission_type !== undefined) {
            if (!['percentage', 'fixed'].includes(body.commission_type)) {
                return NextResponse.json(
                    { error: "Commission type must be 'percentage' or 'fixed'" },
                    { status: 400 }
                );
            }
            updates.push(`commission_type = $${paramIndex++}`);
            values.push(body.commission_type);
        }

        if (body.commission_value !== undefined) {
            if (body.commission_value < 0) {
                return NextResponse.json(
                    { error: "Commission value must be 0 or greater" },
                    { status: 400 }
                );
            }
            updates.push(`commission_value = $${paramIndex++}`);
            values.push(body.commission_value);
        }

        if (body.max_uses !== undefined) {
            updates.push(`max_uses = $${paramIndex++}`);
            values.push(body.max_uses);
        }

        if (body.valid_from !== undefined) {
            updates.push(`valid_from = $${paramIndex++}`);
            values.push(body.valid_from);
        }

        if (body.valid_until !== undefined) {
            updates.push(`valid_until = $${paramIndex++}`);
            values.push(body.valid_until);
        }

        if (body.is_active !== undefined) {
            updates.push(`is_active = $${paramIndex++}`);
            values.push(body.is_active);
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        values.push(id);

        const result = await db.query<PartnerReferral>(
            `UPDATE public.partner_referrals SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Partner referral not found" }, { status: 404 });
        }

        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logCRUD(
            { id: session.sub, email: session.email, role: session.role },
            'update',
            'partner_referrals',
            id,
            body as Record<string, unknown>,
            ipAddress,
            userAgent
        );

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Update Partner Referral Error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requirePermission('referral_codes', 'delete', req);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { session } = authResult;

    try {
        const { id } = await params;

        const existing = await query(`SELECT code, partner_name FROM public.partner_referrals WHERE id = $1`, [id]);
        if (existing.rows.length === 0) {
            return NextResponse.json({ error: "Partner referral not found" }, { status: 404 });
        }

        await db.query('DELETE FROM public.partner_referrals WHERE id = $1', [id]);

        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logCRUD(
            { id: session.sub, email: session.email, role: session.role },
            'delete',
            'partner_referrals',
            id,
            { code: existing.rows[0].code, partner_name: existing.rows[0].partner_name },
            ipAddress,
            userAgent
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Partner Referral Error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
