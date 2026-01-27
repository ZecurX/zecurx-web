import { NextRequest, NextResponse } from "next/server";
import { db, query } from "@/lib/db";
import { requirePermission, getClientIP, getUserAgent } from "@/lib/auth";
import { logCRUD } from "@/lib/audit";
import { ReferralCode, CreateReferralCodeRequest } from "@/types/referral-types";

// Generate a random referral code
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
                rc.*,
                COALESCE(SUM(rcu.discount_applied), 0) as total_discount_given,
                COUNT(rcu.id) as usage_count
            FROM public.referral_codes rc
            LEFT JOIN public.referral_code_usages rcu ON rc.id = rcu.referral_code_id
            GROUP BY rc.id
            ORDER BY rc.created_at DESC
        `);

        return NextResponse.json({ referral_codes: result.rows });
    } catch (error) {
        console.error("Get Referral Codes Error:", error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Failed to fetch referral codes",
            stack: error instanceof Error ? error.stack : undefined
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
        const body: CreateReferralCodeRequest = await req.json();

        // Validate required fields
        if (!body.discount_type || !body.discount_value) {
            return NextResponse.json(
                { error: "Discount type and value are required" },
                { status: 400 }
            );
        }

        // Validate discount type
        if (!['percentage', 'fixed'].includes(body.discount_type)) {
            return NextResponse.json(
                { error: "Discount type must be 'percentage' or 'fixed'" },
                { status: 400 }
            );
        }

        // Validate discount value
        if (body.discount_value <= 0) {
            return NextResponse.json(
                { error: "Discount value must be greater than 0" },
                { status: 400 }
            );
        }

        // For percentage discount, validate it's not over 100
        if (body.discount_type === 'percentage' && body.discount_value > 100) {
            return NextResponse.json(
                { error: "Percentage discount cannot exceed 100%" },
                { status: 400 }
            );
        }

        // Generate or use provided code
        let code = body.code?.toUpperCase().trim();
        if (!code) {
            // Generate a unique code
            let attempts = 0;
            do {
                code = generateCode();
                const existing = await query(
                    `SELECT id FROM public.referral_codes WHERE code = $1`,
                    [code]
                );
                if (existing.rows.length === 0) break;
                attempts++;
            } while (attempts < 10);

            if (attempts >= 10) {
                return NextResponse.json(
                    { error: "Failed to generate unique code" },
                    { status: 500 }
                );
            }
        } else {
            // Check if code already exists
            const existing = await query(
                `SELECT id FROM public.referral_codes WHERE code = $1`,
                [code]
            );
            if (existing.rows.length > 0) {
                return NextResponse.json(
                    { error: "A referral code with this code already exists" },
                    { status: 409 }
                );
            }
        }

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
                session.sub
            ]
        );

        const data = result.rows[0];

        const ipAddress = getClientIP(req);
        const userAgent = getUserAgent(req);
        await logCRUD(
            { id: session.sub, email: session.email, role: session.role },
            'create',
            'referral_codes',
            data.id,
            { code: data.code, discount_type: data.discount_type, discount_value: data.discount_value },
            ipAddress,
            userAgent
        );

        return NextResponse.json(data);
    } catch (error) {
        console.error("Create Referral Code Error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
