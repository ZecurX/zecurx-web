import { NextRequest, NextResponse } from "next/server";
import { db, query } from "@/lib/db";
import { requirePermission, getClientIP, getUserAgent } from "@/lib/auth";
import { logCRUD } from "@/lib/audit";
import { CreatePayoutRequest, PartnerPayout } from "@/types/partner-referral-types";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requirePermission('referral_codes', 'read', req);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id } = await params;

        const result = await query(`
            SELECT * FROM partner_payouts
            WHERE partner_referral_id = $1
            ORDER BY created_at DESC
        `, [id]);

        return NextResponse.json({ payouts: result.rows });
    } catch (error) {
        console.error("Get Partner Payouts Error:", error);
        return NextResponse.json({ error: "Failed to fetch payouts" }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requirePermission('referral_codes', 'create', req);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { session } = authResult;

    try {
        const { id } = await params;
        const body: Omit<CreatePayoutRequest, 'partner_referral_id'> = await req.json();

        if (!body.amount || body.amount <= 0) {
            return NextResponse.json(
                { error: "Payout amount must be greater than 0" },
                { status: 400 }
            );
        }

        const partnerCheck = await query(
            `SELECT pending_payout FROM partner_referrals WHERE id = $1`,
            [id]
        );

        if (partnerCheck.rows.length === 0) {
            return NextResponse.json({ error: "Partner referral not found" }, { status: 404 });
        }

        const pendingPayout = Number(partnerCheck.rows[0].pending_payout);
        if (body.amount > pendingPayout) {
            return NextResponse.json(
                { error: `Payout amount cannot exceed pending balance of ₹${pendingPayout}` },
                { status: 400 }
            );
        }

        const result = await db.query<PartnerPayout>(
            `INSERT INTO partner_payouts (
                partner_referral_id, amount, payout_method, payout_reference, notes, status, processed_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                id,
                body.amount,
                body.payout_method || null,
                body.payout_reference || null,
                body.notes || null,
                'completed',
                session.sub
            ]
        );

        await query(
            `UPDATE partner_referrals SET total_paid_out = total_paid_out + $1 WHERE id = $2`,
            [body.amount, id]
        );

        const payout = result.rows[0];

        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logCRUD(
            { id: session.sub, email: session.email, role: session.role },
            'create',
            'partner_payouts',
            payout.id,
            { partner_referral_id: id, amount: body.amount },
            ipAddress,
            userAgent
        );

        return NextResponse.json(payout);
    } catch (error) {
        console.error("Create Partner Payout Error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
