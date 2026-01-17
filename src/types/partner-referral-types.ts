export type DiscountType = 'percentage' | 'fixed';
export type CommissionType = 'percentage' | 'fixed';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type PayoutMethod = 'bank_transfer' | 'upi' | 'wallet' | 'other';

export interface PartnerReferral {
    id: string;
    partner_name: string;
    partner_email: string;
    partner_phone: string | null;
    partner_notes: string | null;
    code: string;
    user_discount_type: DiscountType;
    user_discount_value: number;
    max_user_discount: number | null;
    min_order_amount: number;
    commission_type: CommissionType;
    commission_value: number;
    max_uses: number | null;
    current_uses: number;
    valid_from: string;
    valid_until: string | null;
    is_active: boolean;
    total_earnings: number;
    total_paid_out: number;
    pending_payout: number;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface PartnerReferralUsage {
    id: string;
    partner_referral_id: string;
    order_id: string;
    payment_id: string | null;
    customer_email: string;
    customer_name: string | null;
    original_amount: number;
    discount_applied: number;
    final_amount: number;
    commission_earned: number;
    is_paid_out: boolean;
    paid_out_at: string | null;
    payout_id: string | null;
    created_at: string;
}

export interface PartnerPayout {
    id: string;
    partner_referral_id: string;
    amount: number;
    payout_method: PayoutMethod | null;
    payout_reference: string | null;
    status: PayoutStatus;
    notes: string | null;
    processed_by: string | null;
    created_at: string;
    processed_at: string | null;
}

export interface CreatePartnerReferralRequest {
    partner_name: string;
    partner_email: string;
    partner_phone?: string;
    partner_notes?: string;
    code?: string;
    user_discount_type: DiscountType;
    user_discount_value: number;
    max_user_discount?: number | null;
    min_order_amount?: number;
    commission_type: CommissionType;
    commission_value: number;
    max_uses?: number | null;
    valid_from?: string;
    valid_until?: string | null;
    is_active?: boolean;
}

export interface UpdatePartnerReferralRequest {
    partner_name?: string;
    partner_email?: string;
    partner_phone?: string | null;
    partner_notes?: string | null;
    code?: string;
    user_discount_type?: DiscountType;
    user_discount_value?: number;
    max_user_discount?: number | null;
    min_order_amount?: number;
    commission_type?: CommissionType;
    commission_value?: number;
    max_uses?: number | null;
    valid_from?: string;
    valid_until?: string | null;
    is_active?: boolean;
}

export interface ValidatePartnerReferralResponse {
    valid: boolean;
    code?: string;
    user_discount_type?: DiscountType;
    user_discount_value?: number;
    discount_amount?: number;
    final_amount?: number;
    partner_name?: string;
    is_partner_referral: boolean;
    error?: string;
}

export interface PartnerReferralWithStats extends PartnerReferral {
    usage_count?: number;
    total_revenue_generated?: number;
}

export interface CreatePayoutRequest {
    partner_referral_id: string;
    amount: number;
    payout_method?: PayoutMethod;
    payout_reference?: string;
    notes?: string;
}
