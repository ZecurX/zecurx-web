-- Adds full-payment option + locked-in coupon/discount tracking to course bookings
SET search_path TO zecurx_admin, public;

-- payment_option: 'deposit' = pay Rs2000 now + balance within 15 days (existing flow),
-- 'full' = pay the full course fee immediately (booking is created straight to fully_paid).
ALTER TABLE course_bookings ADD COLUMN IF NOT EXISTS payment_option TEXT NOT NULL DEFAULT 'deposit';

-- Which coupon (if any) was redeemed at the moment of first payment. Kept for the record;
-- discount_amount below is the number that actually matters for money math.
ALTER TABLE course_bookings ADD COLUMN IF NOT EXISTS referral_code TEXT;
ALTER TABLE course_bookings ADD COLUMN IF NOT EXISTS partner_referral_code TEXT;
ALTER TABLE course_bookings ADD COLUMN IF NOT EXISTS is_partner_referral BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE course_bookings ADD COLUMN IF NOT EXISTS partner_referral_id UUID;
ALTER TABLE course_bookings ADD COLUMN IF NOT EXISTS discount_type TEXT;
ALTER TABLE course_bookings ADD COLUMN IF NOT EXISTS discount_value NUMERIC;

-- Locked-in rupee discount, computed once at first payment (deposit or full) and never
-- recalculated afterwards — this is what keeps the discount valid at the 15-day balance
-- payment even if the code itself has since expired or been exhausted by other customers.
ALTER TABLE course_bookings ADD COLUMN IF NOT EXISTS discount_amount NUMERIC NOT NULL DEFAULT 0;
