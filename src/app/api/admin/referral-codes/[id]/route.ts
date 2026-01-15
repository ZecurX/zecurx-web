import { NextRequest, NextResponse } from "next/server";
import { db, query } from "@/lib/db";
import { requirePermission, getClientIP, getUserAgent } from "@/lib/auth";
import { logCRUD } from "@/lib/audit";
import { ReferralCode, UpdateReferralCodeRequest } from "@/types/referral-types";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requirePermission('referral_codes', 'read', req);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id } = await params;

        const result = await query(`
            SELECT 
                rc.*,
                COALESCE(SUM(rcu.discount_applied), 0) as total_discount_given,
                COUNT(rcu.id) as usage_count
            FROM referral_codes rc
            LEFT JOIN referral_code_usages rcu ON rc.id = rcu.referral_code_id
            WHERE rc.id = $1
            GROUP BY rc.id
        `, [id]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Referral code not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Get Referral Code Error:", error);
        return NextResponse.json({ error: "Failed to fetch referral code" }, { status: 500 });
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
        const body: UpdateReferralCodeRequest = await req.json();

        const updates: string[] = [];
        const values: unknown[] = [];
        let paramIndex = 1;

        if (body.code !== undefined) {
            // Check if code already exists (excluding current record)
            const existing = await query(
                `SELECT id FROM referral_codes WHERE code = $1 AND id != $2`,
                [body.code.toUpperCase().trim(), id]
            );
            if (existing.rows.length > 0) {
                return NextResponse.json(
                    { error: "A referral code with this code already exists" },
                    { status: 409 }
                );
            }
            updates.push(`code = $${paramIndex++}`);
            values.push(body.code.toUpperCase().trim());
        }

        if (body.discount_type !== undefined) {
            if (!['percentage', 'fixed'].includes(body.discount_type)) {
                return NextResponse.json(
                    { error: "Discount type must be 'percentage' or 'fixed'" },
                    { status: 400 }
                );
            }
            updates.push(`discount_type = $${paramIndex++}`);
            values.push(body.discount_type);
        }

        if (body.discount_value !== undefined) {
            if (body.discount_value <= 0) {
                return NextResponse.json(
                    { error: "Discount value must be greater than 0" },
                    { status: 400 }
                );
            }
            updates.push(`discount_value = $${paramIndex++}`);
            values.push(body.discount_value);
        }

        if (body.min_order_amount !== undefined) {
            updates.push(`min_order_amount = $${paramIndex++}`);
            values.push(body.min_order_amount);
        }

        if (body.max_discount !== undefined) {
            updates.push(`max_discount = $${paramIndex++}`);
            values.push(body.max_discount);
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

        const result = await db.query<ReferralCode>(
            `UPDATE referral_codes SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Referral code not found" }, { status: 404 });
        }

        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logCRUD(
            { id: session.sub, email: session.email, role: session.role },
            'update',
            'referral_codes',
            id,
            body as Record<string, unknown>,
            ipAddress,
            userAgent
        );

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Update Referral Code Error:", error);
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

        // Get the code before deleting for audit log
        const existing = await query(`SELECT code FROM referral_codes WHERE id = $1`, [id]);
        if (existing.rows.length === 0) {
            return NextResponse.json({ error: "Referral code not found" }, { status: 404 });
        }

        await db.query('DELETE FROM referral_codes WHERE id = $1', [id]);

        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logCRUD(
            { id: session.sub, email: session.email, role: session.role },
            'delete',
            'referral_codes',
            id,
            { code: existing.rows[0].code },
            ipAddress,
            userAgent
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Referral Code Error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
