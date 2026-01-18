import { query } from '@/lib/db';
import type { PoolClient } from 'pg';

interface DiscountValidationResult {
    valid: boolean;
    verifiedDiscount: number;
    error?: string;
}

interface QueryExecutor {
    query: (text: string, params: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>;
}

function createQueryExecutor(client?: PoolClient): QueryExecutor {
    if (client) {
        return { query: (text, params) => client.query(text, params) };
    }
    return { query };
}

export async function validateDiscount(
    orderAmount: number,
    discountAmount: number,
    referralCode?: string | null,
    partnerReferralCode?: string | null,
    client?: PoolClient
): Promise<DiscountValidationResult> {
    if (discountAmount <= 0) {
        return { valid: true, verifiedDiscount: 0 };
    }

    const executor = createQueryExecutor(client);
    let verifiedDiscount = 0;

    if (referralCode) {
        const codeResult = await executor.query(`
            SELECT discount_type, discount_value, max_discount, min_order_amount
            FROM referral_codes
            WHERE code = $1 AND is_active = true
            AND (valid_until IS NULL OR valid_until > NOW())
            AND (max_uses IS NULL OR current_uses < max_uses)
        `, [referralCode]);

        if (codeResult.rows.length > 0) {
            const code = codeResult.rows[0];
            if (orderAmount >= Number(code.min_order_amount || 0)) {
                if (code.discount_type === 'percentage') {
                    const maxDiscount = code.max_discount != null ? Number(code.max_discount) : Infinity;
                    verifiedDiscount = Math.min(
                        orderAmount * Number(code.discount_value) / 100,
                        maxDiscount
                    );
                } else {
                    verifiedDiscount = Number(code.discount_value);
                }
            }
        }
    } else if (partnerReferralCode) {
        const codeResult = await executor.query(`
            SELECT user_discount_type, user_discount_value, max_user_discount, min_order_amount
            FROM partner_referrals
            WHERE code = $1 AND is_active = true
            AND (valid_until IS NULL OR valid_until > NOW())
            AND (max_uses IS NULL OR current_uses < max_uses)
        `, [partnerReferralCode]);

        if (codeResult.rows.length > 0) {
            const code = codeResult.rows[0];
            if (orderAmount >= Number(code.min_order_amount || 0)) {
                if (code.user_discount_type === 'percentage') {
                    const maxDiscount = code.max_user_discount != null ? Number(code.max_user_discount) : Infinity;
                    verifiedDiscount = Math.min(
                        orderAmount * Number(code.user_discount_value) / 100,
                        maxDiscount
                    );
                } else {
                    verifiedDiscount = Number(code.user_discount_value);
                }
            }
        }
    }

    if (Math.abs(verifiedDiscount - discountAmount) > 0.01) {
        return {
            valid: false,
            verifiedDiscount: 0,
            error: 'Invalid discount. Please remove the code and try again.'
        };
    }

    return { valid: true, verifiedDiscount };
}

export async function incrementReferralCodeUsage(
    referralCode?: string | null,
    partnerReferralCode?: string | null,
    client?: PoolClient
): Promise<boolean> {
    if (!referralCode && !partnerReferralCode) {
        return true;
    }

    const executor = createQueryExecutor(client);

    if (referralCode) {
        const result = await executor.query(`
            UPDATE referral_codes 
            SET current_uses = current_uses + 1, updated_at = NOW()
            WHERE code = $1 
            AND is_active = true
            AND (valid_until IS NULL OR valid_until > NOW())
            AND (max_uses IS NULL OR current_uses < max_uses)
            RETURNING id
        `, [referralCode]);
        
        return result.rows.length > 0;
    }

    if (partnerReferralCode) {
        const result = await executor.query(`
            UPDATE partner_referrals 
            SET current_uses = current_uses + 1, updated_at = NOW()
            WHERE code = $1 
            AND is_active = true
            AND (valid_until IS NULL OR valid_until > NOW())
            AND (max_uses IS NULL OR current_uses < max_uses)
            RETURNING id
        `, [partnerReferralCode]);
        
        return result.rows.length > 0;
    }

    return true;
}
