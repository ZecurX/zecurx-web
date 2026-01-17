-- Partner Referrals System Schema
-- Commission-based referral system for marketing partners and influencers

-- Main table for partner/influencer referral codes
CREATE TABLE IF NOT EXISTS partner_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Partner details
    partner_name VARCHAR(255) NOT NULL,
    partner_email VARCHAR(255) NOT NULL,
    partner_phone VARCHAR(20),
    partner_notes TEXT,
    
    -- Referral code
    code VARCHAR(50) NOT NULL UNIQUE,
    
    -- User discount settings (what the referred user gets)
    user_discount_type VARCHAR(20) NOT NULL CHECK (user_discount_type IN ('percentage', 'fixed')),
    user_discount_value DECIMAL(10, 2) NOT NULL CHECK (user_discount_value >= 0),
    max_user_discount DECIMAL(10, 2), -- Cap for percentage discounts
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    
    -- Partner commission settings (what the partner earns)
    commission_type VARCHAR(20) NOT NULL CHECK (commission_type IN ('percentage', 'fixed')),
    commission_value DECIMAL(10, 2) NOT NULL CHECK (commission_value >= 0),
    
    -- Usage limits and validity
    max_uses INTEGER, -- NULL means unlimited
    current_uses INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Earnings tracking (denormalized for quick access)
    total_earnings DECIMAL(12, 2) DEFAULT 0,
    total_paid_out DECIMAL(12, 2) DEFAULT 0,
    pending_payout DECIMAL(12, 2) GENERATED ALWAYS AS (total_earnings - total_paid_out) STORED,
    
    -- Audit
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track each usage of a partner referral code
CREATE TABLE IF NOT EXISTS partner_referral_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Link to partner referral
    partner_referral_id UUID NOT NULL REFERENCES partner_referrals(id) ON DELETE CASCADE,
    
    -- Order details
    order_id VARCHAR(255) NOT NULL,
    payment_id VARCHAR(255),
    
    -- Customer who used the code
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    
    -- Amount details
    original_amount DECIMAL(10, 2) NOT NULL,
    discount_applied DECIMAL(10, 2) NOT NULL,
    final_amount DECIMAL(10, 2) NOT NULL,
    
    -- Commission for this transaction
    commission_earned DECIMAL(10, 2) NOT NULL,
    
    -- Payout status for this usage
    is_paid_out BOOLEAN DEFAULT false,
    paid_out_at TIMESTAMP WITH TIME ZONE,
    payout_id UUID, -- Reference to payout batch if applicable
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track payout batches to partners
CREATE TABLE IF NOT EXISTS partner_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Link to partner
    partner_referral_id UUID NOT NULL REFERENCES partner_referrals(id) ON DELETE CASCADE,
    
    -- Payout details
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    payout_method VARCHAR(50), -- 'bank_transfer', 'upi', 'wallet', etc.
    payout_reference VARCHAR(255), -- Transaction ID or reference number
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    
    -- Notes
    notes TEXT,
    
    -- Audit
    processed_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_partner_referrals_code ON partner_referrals(code);
CREATE INDEX IF NOT EXISTS idx_partner_referrals_partner_email ON partner_referrals(partner_email);
CREATE INDEX IF NOT EXISTS idx_partner_referrals_is_active ON partner_referrals(is_active);

CREATE INDEX IF NOT EXISTS idx_partner_referral_usages_partner_id ON partner_referral_usages(partner_referral_id);
CREATE INDEX IF NOT EXISTS idx_partner_referral_usages_customer_email ON partner_referral_usages(customer_email);
CREATE INDEX IF NOT EXISTS idx_partner_referral_usages_order_id ON partner_referral_usages(order_id);
CREATE INDEX IF NOT EXISTS idx_partner_referral_usages_is_paid_out ON partner_referral_usages(is_paid_out);

CREATE INDEX IF NOT EXISTS idx_partner_payouts_partner_id ON partner_payouts(partner_referral_id);
CREATE INDEX IF NOT EXISTS idx_partner_payouts_status ON partner_payouts(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_partner_referrals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS partner_referrals_updated_at ON partner_referrals;
CREATE TRIGGER partner_referrals_updated_at
    BEFORE UPDATE ON partner_referrals
    FOR EACH ROW
    EXECUTE FUNCTION update_partner_referrals_updated_at();
