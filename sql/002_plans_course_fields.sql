-- Add course-specific fields to plans table so academy page is fully DB-driven
SET search_path TO zecurx_admin, public;

-- New columns for full course data
ALTER TABLE plans ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS level TEXT;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS logo TEXT;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS original_price NUMERIC;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS popular BOOLEAN DEFAULT false;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS students_count INTEGER DEFAULT 0;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS brochure_link TEXT;

-- Seed existing academy courses with current static data
-- CyberSecurity + Generative AI Bundle
UPDATE plans SET
    duration = '3 Months',
    level = 'Beginner',
    features = '["Full practical exposure on live targets","ISO Verified Certification","3 ISO Certified Exam Vouchers","AI for Threat Detection & Response","Prompt Engineering for Security Ops","Hands-on Labs & Capstone Project","Internship Opportunity"]'::jsonb,
    logo = '/images/courses/bundle-ai.png',
    original_price = 34999,
    popular = true,
    students_count = 150
WHERE id = '93a3af86-761a-47a9-80f5-a97534916364';

-- zxCPEH - Certified Professional Ethical Hacker
UPDATE plans SET
    duration = '60 Hours',
    level = 'Intermediate',
    features = '["ISO Verified Certification","ISO Certified Exam Voucher","Advanced Exploitation","Network & Web Security","Privilege Escalation","Active Directory Attacks","Project-Based Learning"]'::jsonb,
    logo = '/images/courses/cpeh.png',
    original_price = 35499,
    popular = false,
    students_count = 500
WHERE id = '06a10be6-115a-4a83-b338-67168abcce1a';

-- zxCPPT - Certified Professional Pen Tester
UPDATE plans SET
    duration = '80 Hours',
    level = 'Advanced',
    features = '["ISO Verified Certification","ISO Certified Exam Voucher","Red Teaming Methodology","Advanced Evasion Techniques","Report Writing & Documentation","Custom Exploit Development","Industry Standard Tools"]'::jsonb,
    logo = '/images/courses/cppt.png',
    original_price = 49999,
    popular = false,
    students_count = 200
WHERE id = '1033198a-bf65-4183-9e6e-aab727903039';

-- zxGAIP - Generative AI Professional
UPDATE plans SET
    duration = '40 Hours',
    level = 'Intermediate',
    features = '["ISO Verified Certification","ISO Certified Exam Voucher","LLMs for Security","Automated Threat Hunting","Secure AI Deployment","AI Risk Management","Real-world Case Studies"]'::jsonb,
    logo = '/images/courses/gaip.png',
    original_price = 35499,
    popular = false,
    students_count = 120
WHERE id = 'b5276793-8c55-4759-8206-3d1a833fe304';

-- zxCCP - Certified Cybersecurity Practitioner
UPDATE plans SET
    duration = 'Custom',
    level = 'Beginner',
    features = '["Incident Response Basics","Security Controls Implementation","Policy & Compliance","Log Analysis","Institutional Training"]'::jsonb,
    logo = '/images/courses/zxCCP.png',
    original_price = NULL,
    popular = false,
    students_count = 0
WHERE id = '7f0e2cb3-82c1-4634-9a95-67a2ae14a815';

-- zxCCF - Certified Cybersecurity Foundations
UPDATE plans SET
    duration = 'Custom',
    level = 'Beginner',
    features = '["Core Security Concepts","Network Fundamentals","Cryptography Basics","Security Ethics","Career Roadmap"]'::jsonb,
    logo = '/images/courses/zxCCF.png',
    original_price = NULL,
    popular = false,
    students_count = 0
WHERE id = '3613d162-d801-47c6-9305-719f999738c8';

-- zxCCE - Certified Cybersecurity Expert
UPDATE plans SET
    duration = 'Custom',
    level = 'Expert',
    features = '["Security Governance","Risk Management","C-Level Communication","Enterprise Architecture","Strategic Planning"]'::jsonb,
    logo = '/images/courses/zxCCE.png',
    original_price = NULL,
    popular = false,
    students_count = 0
WHERE id = 'ef34cbc8-c918-4e64-bd88-799863b299e1';

-- zxCFD - Certified Fullstack Dev
UPDATE plans SET
    duration = 'Coming Soon',
    level = 'Intermediate',
    features = '["ISO Verified Certification","ISO Certified Exam Voucher","Secure Coding Practices","Modern Stack (Next.js, Node)","Database Security","API Development","DevSecOps Basics"]'::jsonb,
    logo = '/images/courses/zxCFD.png',
    original_price = NULL,
    popular = false,
    students_count = 0
WHERE id = '9bce53be-103e-46b9-9fa0-2b91260f38db';

-- Seed brochure links (CDN paths — resolved to full URLs by the application)
UPDATE plans SET brochure_link = 'brochures/zxCPEH_Brochure_v3.pdf'
WHERE id = '06a10be6-115a-4a83-b338-67168abcce1a';

UPDATE plans SET brochure_link = 'brochures/zxCPPT_Brochure_v3.pdf'
WHERE id = '1033198a-bf65-4183-9e6e-aab727903039';

UPDATE plans SET brochure_link = 'brochures/Course_Brochure_zxCCP.pdf'
WHERE id = '7f0e2cb3-82c1-4634-9a95-67a2ae14a815';

UPDATE plans SET brochure_link = 'brochures/Course_Brochure_zxCCF.pdf'
WHERE id = '3613d162-d801-47c6-9305-719f999738c8';

UPDATE plans SET brochure_link = 'brochures/Course_Brochure_zxCCE.pdf'
WHERE id = 'ef34cbc8-c918-4e64-bd88-799863b299e1';
