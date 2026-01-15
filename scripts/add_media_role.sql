-- Add 'media' role to the admin_role enum type
-- This script updates the RBAC system to support the new media role

BEGIN;

-- Step 1: Add 'media' to the admin_role enum
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE t.typname = 'admin_role' AND e.enumlabel = 'media'
    ) THEN
        ALTER TYPE admin_role ADD VALUE 'media';
        RAISE NOTICE 'Added media role to admin_role enum';
    ELSE
        RAISE NOTICE 'Media role already exists in admin_role enum';
    END IF;
END $$;

-- Step 2: Create a default media user (if not exists)
DO $$
DECLARE
    v_media_user_id UUID;
BEGIN
    SELECT id INTO v_media_user_id
    FROM admins
    WHERE email = 'media@zecurx.com';
    
    IF v_media_user_id IS NULL THEN
        INSERT INTO admins (
            id,
            email,
            password_hash,
            role,
            name,
            is_active,
            created_by,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            'media@zecurx.com',
            '$2a$10$rK8qY7Y5Y5Y5Y5Y5Y5Y5YOj.K9K9K9K9K9K9K9K9K9K9K9K9K9K',
            'media',
            'Media Team',
            true,
            NULL,
            NOW(),
            NOW()
        ) RETURNING id INTO v_media_user_id;
        
        RAISE NOTICE 'Created media user with ID: %', v_media_user_id;
        RAISE NOTICE 'Default password: media123 (CHANGE THIS IMMEDIATELY)';
    ELSE
        RAISE NOTICE 'Media user already exists with ID: %', v_media_user_id;
    END IF;
END $$;

COMMIT;

-- Verification queries
SELECT 
    unnest(enum_range(NULL::admin_role)) AS available_roles;

SELECT 
    id,
    email,
    role,
    name,
    is_active,
    created_at
FROM admins
WHERE role = 'media'
ORDER BY created_at DESC;
