// Referral Code Types

export type DiscountType = 'percentage' | 'fixed';

export interface ReferralCode {
    id: string;
    code: string;
    discount_type: DiscountType;
    discount_value: number;
    min_order_amount: number;
    max_discount: number | null;
    max_uses: number | null;
    current_uses: number;
    valid_from: string;
    valid_until: string | null;
    is_active: boolean;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface ReferralCodeUsage {
    id: string;
    referral_code_id: string;
    order_id: string;
    customer_email: string;
    original_amount: number;
    discount_applied: number;
    final_amount: number;
    created_at: string;
}

// Request types
export interface CreateReferralCodeRequest {
    code?: string; // Optional - will auto-generate if not provided
    discount_type: DiscountType;
    discount_value: number;
    min_order_amount?: number;
    max_discount?: number;
    max_uses?: number;
    valid_from?: string;
    valid_until?: string;
    is_active?: boolean;
}

export interface UpdateReferralCodeRequest {
    code?: string;
    discount_type?: DiscountType;
    discount_value?: number;
    min_order_amount?: number;
    max_discount?: number | null;
    max_uses?: number | null;
    valid_from?: string;
    valid_until?: string | null;
    is_active?: boolean;
}

// Validation response
export interface ValidateReferralCodeResponse {
    valid: boolean;
    code?: string;
    discount_type?: DiscountType;
    discount_value?: number;
    discount_amount?: number;
    final_amount?: number;
    error?: string;
}

// API response types
export interface ReferralCodeWithStats extends ReferralCode {
    total_discount_given?: number;
    usage_count?: number;
}
