-- ============================================
-- SEMINAR SYSTEM SCHEMA
-- Run this in your PostgreSQL database
-- ============================================

-- Create seminar schema
CREATE SCHEMA IF NOT EXISTS seminar;

-- ============================================
-- 1. SEMINARS TABLE
-- Auto-created when college submits booking form
-- ============================================
CREATE TABLE seminar.seminars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Seminar Details (from enhanced booking form)
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMPTZ NOT NULL,
    time TEXT NOT NULL,                    -- Display format: "14:00 EST"
    duration TEXT NOT NULL,                -- "60 min", "90 min", "2 hrs", etc.
    speaker_name TEXT NOT NULL,
    speaker_title TEXT,                    -- "Lead Researcher", "CTO", etc.
    seminar_type TEXT,                     -- "Threat Briefing", "Workshop", etc.
    topic TEXT,                            -- Topic of interest from form
    location_type TEXT CHECK (location_type IN ('online', 'onsite')) DEFAULT 'onsite',
    venue_address TEXT,                    -- Physical location if onsite
    image_url TEXT,                        -- Cover image
    brochure_url TEXT,                     -- PDF brochure (admin uploads)
    max_attendees INT,
    
    -- College/Organization info (from booker)
    organization_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    additional_notes TEXT,                 -- Message from booking form
    
    -- Admin Controls
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    registration_enabled BOOLEAN DEFAULT true,
    certificate_enabled BOOLEAN DEFAULT false,
    rejection_reason TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    approved_by UUID
);

-- ============================================
-- 2. REGISTRATIONS TABLE
-- Students register for specific seminars
-- ============================================
CREATE TABLE seminar.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seminar_id UUID NOT NULL REFERENCES seminar.seminars(id) ON DELETE CASCADE,
    
    -- Student Info
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    college_name TEXT,
    year TEXT,                             -- "1st Year", "2nd Year", etc.
    city_state TEXT,
    
    -- Verification
    email_verified BOOLEAN DEFAULT false,
    
    -- Status
    attended BOOLEAN DEFAULT false,        -- Admin marks after event
    is_retroactive BOOLEAN DEFAULT false,  -- Registered after seminar (for cert)
    
    -- Metadata
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    
    UNIQUE(seminar_id, email)
);

-- ============================================
-- 3. FEEDBACK TABLE
-- 4-step feedback form data
-- ============================================
CREATE TABLE seminar.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES seminar.registrations(id) ON DELETE CASCADE,
    seminar_id UUID NOT NULL REFERENCES seminar.seminars(id) ON DELETE CASCADE,
    
    -- Step 1: Basic Info
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    college_name TEXT,
    year TEXT,
    city_state TEXT,
    reminder_contact TEXT,                 -- "Yes - <contact>" or "No"
    
    -- Step 2: Career Interests
    career_interest TEXT,                  -- Ethical Hacking, Software Dev, AI/ML, etc.
    offensive_security_reason TEXT,        -- Why/why not interested
    
    -- Step 3: Seminar Feedback
    seminar_rating INT CHECK (seminar_rating >= 1 AND seminar_rating <= 5),
    most_valuable_part TEXT,
    future_suggestions TEXT,
    join_zecurx BOOLEAN,
    
    -- Step 4: Certificate
    certificate_name TEXT NOT NULL,        -- Confirmed name for certificate
    
    -- Metadata
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(seminar_id, email)
);

-- ============================================
-- 4. CERTIFICATES TABLE
-- Generated after feedback submission
-- ============================================
CREATE TABLE seminar.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES seminar.registrations(id) ON DELETE CASCADE,
    feedback_id UUID REFERENCES seminar.feedback(id) ON DELETE CASCADE,
    seminar_id UUID NOT NULL REFERENCES seminar.seminars(id) ON DELETE CASCADE,
    
    -- Certificate Details
    certificate_id TEXT UNIQUE NOT NULL,   -- ZX-SEM-2025-ABC123
    recipient_name TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    seminar_title TEXT NOT NULL,
    seminar_date DATE NOT NULL,
    speaker_name TEXT,
    organization TEXT,                     -- College name
    
    -- Storage
    pdf_url TEXT,                          -- Stored in CDN
    
    -- Metadata
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    download_count INT DEFAULT 0,
    last_downloaded_at TIMESTAMPTZ,
    
    UNIQUE(registration_id)
);

-- ============================================
-- 5. OTP VERIFICATIONS TABLE
-- Email OTP for registration and certificate access
-- ============================================
CREATE TABLE seminar.otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('registration', 'certificate')),
    seminar_id UUID REFERENCES seminar.seminars(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN DEFAULT false,
    attempts INT DEFAULT 0,                -- Track failed attempts
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. CERTIFICATE NAME CHANGE REQUESTS TABLE
-- When certificate name differs from registered name
-- ============================================
CREATE TABLE seminar.certificate_name_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_id UUID REFERENCES seminar.feedback(id) ON DELETE CASCADE,
    seminar_id UUID NOT NULL REFERENCES seminar.seminars(id) ON DELETE CASCADE,
    registration_id UUID REFERENCES seminar.registrations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    registered_name TEXT NOT NULL,
    requested_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_seminars_status ON seminar.seminars(status);
CREATE INDEX idx_seminars_date ON seminar.seminars(date);
CREATE INDEX idx_seminars_status_date ON seminar.seminars(status, date);
CREATE INDEX idx_registrations_seminar ON seminar.registrations(seminar_id);
CREATE INDEX idx_registrations_email ON seminar.registrations(email);
CREATE INDEX idx_registrations_seminar_email ON seminar.registrations(seminar_id, email);
CREATE INDEX idx_feedback_seminar ON seminar.feedback(seminar_id);
CREATE INDEX idx_feedback_email ON seminar.feedback(email);
CREATE INDEX idx_certificates_certificate_id ON seminar.certificates(certificate_id);
CREATE INDEX idx_certificates_email ON seminar.certificates(recipient_email);
CREATE INDEX idx_otp_email_purpose ON seminar.otp_verifications(email, purpose);
CREATE INDEX idx_otp_seminar ON seminar.otp_verifications(seminar_id);
CREATE INDEX idx_name_requests_seminar ON seminar.certificate_name_requests(seminar_id);
CREATE INDEX idx_name_requests_status ON seminar.certificate_name_requests(status);
CREATE INDEX idx_name_requests_email ON seminar.certificate_name_requests(email);

-- ============================================
-- TRIGGER: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION seminar.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER seminars_updated_at
    BEFORE UPDATE ON seminar.seminars
    FOR EACH ROW
    EXECUTE FUNCTION seminar.update_updated_at();

-- ============================================
-- CLEANUP: Remove expired OTPs (run periodically)
-- ============================================
-- DELETE FROM seminar.otp_verifications WHERE expires_at < NOW();
