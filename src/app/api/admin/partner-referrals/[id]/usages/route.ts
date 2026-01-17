import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await requirePermission('referral_codes', 'read', req);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id } = await params;

        const result = await query(`
            SELECT * FROM partner_referral_usages
            WHERE partner_referral_id = $1
            ORDER BY created_at DESC
        `, [id]);

        return NextResponse.json({ usages: result.rows });
    } catch (error) {
        console.error("Get Partner Referral Usages Error:", error);
        return NextResponse.json({ error: "Failed to fetch usages" }, { status: 500 });
    }
}
