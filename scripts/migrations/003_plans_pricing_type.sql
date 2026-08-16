-- Add pricing_type column to distinguish how price is displayed on the academy page
SET search_path TO zecurx_admin, public;

-- pricing_type: 'fixed' = show price + Enroll Now, 'contact' = Contact for Pricing, 'institutional' = Institutional Only badge
ALTER TABLE plans ADD COLUMN IF NOT EXISTS pricing_type TEXT DEFAULT 'fixed';

-- Set existing courses to their correct pricing_type
-- Institution Only courses (zxCCP, zxCCF, zxCCE)
UPDATE plans SET pricing_type = 'institutional'
WHERE id IN (
    '7f0e2cb3-82c1-4634-9a95-67a2ae14a815',  -- zxCCP
    '3613d162-d801-47c6-9305-719f999738c8',  -- zxCCF
    'ef34cbc8-c918-4e64-bd88-799863b299e1'   -- zxCCE
);

-- Contact for Pricing (zxCFD - Coming Soon)
UPDATE plans SET pricing_type = 'contact'
WHERE id = '9bce53be-103e-46b9-9fa0-2b91260f38db';  -- zxCFD

-- All others already default to 'fixed'
