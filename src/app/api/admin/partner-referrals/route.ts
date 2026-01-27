import { NextRequest, NextResponse } from "next/server";
import { db, query } from "@/lib/db";
import { requirePermission, getClientIP, getUserAgent } from "@/lib/auth";
import { logCRUD } from "@/lib/audit";
import { PartnerReferral, CreatePartnerReferralRequest } from "@/types/partner-referral-types";

function generateCode(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function GET(req: NextRequest) {
    const authResult = await requirePermission('referral_codes', 'read', req);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const result = await query(`
            SELECT 
                pr.*,
                COUNT(pru.id) as usage_count,
                COALESCE(SUM(pru.original_amount), 0) as total_revenue_generated
            FROM public.partner_referrals pr
            LEFT JOIN public.partner_referral_usages pru ON pr.id = pru.partner_referral_id
            GROUP BY pr.id
            ORDER BY pr.created_at DESC
        `);

        return NextResponse.json({ partner_referrals: result.rows });
    } catch (error) {
        console.error("Get Partner Referrals Error:", error);
        return NextResponse.json({
            error: "Failed to fetch partner referrals"
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const authResult = await requirePermission('referral_codes', 'create', req);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { session } = authResult;

    try {
        const body: CreatePartnerReferralRequest = await req.json();

        if (!body.partner_name || !body.partner_email) {
            return NextResponse.json(
                { error: "Partner name and email are required" },
                { status: 400 }
            );
        }

        if (!body.user_discount_type || body.user_discount_value === undefined) {
            return NextResponse.json(
                { error: "User discount type and value are required" },
                { status: 400 }
            );
        }

        if (!body.commission_type || body.commission_value === undefined) {
            return NextResponse.json(
                { error: "Commission type and value are required" },
                { status: 400 }
            );
        }

        if (!['percentage', 'fixed'].includes(body.user_discount_type)) {
            return NextResponse.json(
                { error: "User discount type must be 'percentage' or 'fixed'" },
                { status: 400 }
            );
        }

        if (!['percentage', 'fixed'].includes(body.commission_type)) {
            return NextResponse.json(
                { error: "Commission type must be 'percentage' or 'fixed'" },
                { status: 400 }
            );
        }

        if (body.user_discount_value < 0) {
            return NextResponse.json(
                { error: "User discount value must be 0 or greater" },
                { status: 400 }
            );
        }

        if (body.commission_value < 0) {
            return NextResponse.json(
                { error: "Commission value must be 0 or greater" },
                { status: 400 }
            );
        }

        if (body.user_discount_type === 'percentage' && body.user_discount_value > 100) {
            return NextResponse.json(
                { error: "Percentage user discount cannot exceed 100%" },
                { status: 400 }
            );
        }

        if (body.commission_type === 'percentage' && body.commission_value > 100) {
            return NextResponse.json(
                { error: "Percentage commission cannot exceed 100%" },
                { status: 400 }
            );
        }

        let code = body.code?.toUpperCase().trim();
        if (!code) {
            let attempts = 0;
            do {
                code = generateCode();
                const existingPartner = await query(
                    `SELECT id FROM public.partner_referrals WHERE code = $1`,
                    [code]
                );
                const existingRegular = await query(
                    `SELECT id FROM public.referral_codes WHERE code = $1`,
                    [code]
                );
                if (existingPartner.rows.length === 0 && existingRegular.rows.length === 0) break;
                attempts++;
            } while (attempts < 10);

            if (attempts >= 10) {
                return NextResponse.json(
                    { error: "Failed to generate unique code" },
                    { status: 500 }
                );
            }
        } else {
            const existingPartner = await query(
                `SELECT id FROM public.partner_referrals WHERE code = $1`,
                [code]
            );
            const existingRegular = await query(
                `SELECT id FROM public.referral_codes WHERE code = $1`,
                [code]
            );
            if (existingPartner.rows.length > 0 || existingRegular.rows.length > 0) {
                return NextResponse.json(
                    { error: "A referral code with this code already exists" },
                    { status: 409 }
                );
            }
        }

        const result = await db.query<PartnerReferral>(
            `INSERT INTO public.partner_referrals (
                partner_name, partner_email, partner_phone, partner_notes,
                code, user_discount_type, user_discount_value, max_user_discount, min_order_amount,
                commission_type, commission_value, max_uses, valid_from, valid_until, is_active, created_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *`,
            [
                body.partner_name.trim(),
                body.partner_email.trim().toLowerCase(),
                body.partner_phone?.trim() || null,
                body.partner_notes?.trim() || null,
                code,
                body.user_discount_type,
                body.user_discount_value,
                body.max_user_discount ?? null,
                body.min_order_amount || 0,
                body.commission_type,
                body.commission_value,
                body.max_uses ?? null,
                body.valid_from || new Date().toISOString(),
                body.valid_until || null,
                body.is_active !== false,
                session.sub
            ]
        );

        const data = result.rows[0];

        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logCRUD(
            { id: session.sub, email: session.email, role: session.role },
            'create',
            'partner_referrals',
            data.id,
            { code: data.code, partner_name: data.partner_name, partner_email: data.partner_email },
            ipAddress,
            userAgent
        );

        return NextResponse.json(data);
    } catch (error) {
        console.error("Create Partner Referral Error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
