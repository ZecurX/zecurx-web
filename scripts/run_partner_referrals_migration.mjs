// Run this script to create the partner_referrals tables
// Usage: node scripts/run_partner_referrals_migration.mjs

import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

const migrationSQL = `
-- Partner Referrals System Schema for PUBLIC schema

-- Main table for partner/influencer referral codes
CREATE TABLE IF NOT EXISTS public.partner_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_name VARCHAR(255) NOT NULL,
    partner_email VARCHAR(255) NOT NULL,
    partner_phone VARCHAR(20),
    partner_notes TEXT,
    code VARCHAR(50) NOT NULL UNIQUE,
    user_discount_type VARCHAR(20) NOT NULL CHECK (user_discount_type IN ('percentage', 'fixed')),
    user_discount_value DECIMAL(10, 2) NOT NULL CHECK (user_discount_value >= 0),
    max_user_discount DECIMAL(10, 2),
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    commission_type VARCHAR(20) NOT NULL CHECK (commission_type IN ('percentage', 'fixed')),
    commission_value DECIMAL(10, 2) NOT NULL CHECK (commission_value >= 0),
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    total_earnings DECIMAL(12, 2) DEFAULT 0,
    total_paid_out DECIMAL(12, 2) DEFAULT 0,
    pending_payout DECIMAL(12, 2) GENERATED ALWAYS AS (total_earnings - total_paid_out) STORED,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track each usage of a partner referral code
CREATE TABLE IF NOT EXISTS public.partner_referral_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_referral_id UUID NOT NULL REFERENCES public.partner_referrals(id) ON DELETE CASCADE,
    order_id VARCHAR(255) NOT NULL,
    payment_id VARCHAR(255),
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    original_amount DECIMAL(10, 2) NOT NULL,
    discount_applied DECIMAL(10, 2) NOT NULL,
    final_amount DECIMAL(10, 2) NOT NULL,
    commission_earned DECIMAL(10, 2) NOT NULL,
    is_paid_out BOOLEAN DEFAULT false,
    paid_out_at TIMESTAMP WITH TIME ZONE,
    payout_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track payout batches to partners
CREATE TABLE IF NOT EXISTS public.partner_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_referral_id UUID NOT NULL REFERENCES public.partner_referrals(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    payout_method VARCHAR(50),
    payout_reference VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    notes TEXT,
    processed_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_public_partner_referrals_code ON public.partner_referrals(code);
CREATE INDEX IF NOT EXISTS idx_public_partner_referrals_partner_email ON public.partner_referrals(partner_email);
CREATE INDEX IF NOT EXISTS idx_public_partner_referrals_is_active ON public.partner_referrals(is_active);
CREATE INDEX IF NOT EXISTS idx_public_partner_referral_usages_partner_id ON public.partner_referral_usages(partner_referral_id);
CREATE INDEX IF NOT EXISTS idx_public_partner_referral_usages_customer_email ON public.partner_referral_usages(customer_email);
CREATE INDEX IF NOT EXISTS idx_public_partner_referral_usages_order_id ON public.partner_referral_usages(order_id);
CREATE INDEX IF NOT EXISTS idx_public_partner_referral_usages_is_paid_out ON public.partner_referral_usages(is_paid_out);
CREATE INDEX IF NOT EXISTS idx_public_partner_payouts_partner_id ON public.partner_payouts(partner_referral_id);
CREATE INDEX IF NOT EXISTS idx_public_partner_payouts_status ON public.partner_payouts(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_partner_referrals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS partner_referrals_updated_at ON public.partner_referrals;
CREATE TRIGGER partner_referrals_updated_at
    BEFORE UPDATE ON public.partner_referrals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_partner_referrals_updated_at();
`;

async function runMigration() {
    console.log('🚀 Running partner_referrals migration...');
    console.log('📡 Connecting to database...');

    try {
        const client = await pool.connect();
        console.log('✅ Connected to database');

        console.log('📝 Creating tables...');
        await client.query(migrationSQL);
        console.log('✅ Migration completed successfully!');

        // Verify tables exist
        const result = await client.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('partner_referrals', 'partner_referral_usages', 'partner_payouts')
            ORDER BY table_name
        `);

        console.log('\n📋 Created tables:');
        result.rows.forEach(row => console.log(`   - ${row.table_name}`));

        client.release();
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

runMigration();
