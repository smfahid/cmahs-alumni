-- Registration Validation and Database Setup
-- Run this SQL in your Supabase SQL Editor to ensure all required columns exist

-- =====================================================
-- USERS TABLE UPDATES
-- =====================================================

-- Ensure all required columns exist in users table
DO $$ 
BEGIN
    -- Add gender column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'gender'
    ) THEN
        ALTER TABLE users ADD COLUMN gender TEXT;
    END IF;

    -- Add nid_number column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'nid_number'
    ) THEN
        ALTER TABLE users ADD COLUMN nid_number TEXT;
    END IF;

    -- Add batch column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'batch'
    ) THEN
        ALTER TABLE users ADD COLUMN batch TEXT;
    END IF;

    -- Add location column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'location'
    ) THEN
        ALTER TABLE users ADD COLUMN location TEXT;
    END IF;

    -- Add is_approved column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'is_approved'
    ) THEN
        ALTER TABLE users ADD COLUMN is_approved BOOLEAN DEFAULT false;
    END IF;

    -- Add role column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'member';
    END IF;
END $$;

-- =====================================================
-- MEMBER_DETAILS TABLE UPDATES
-- =====================================================

-- Create member_details table if it doesn't exist
CREATE TABLE IF NOT EXISTS member_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    father_name TEXT,
    mother_name TEXT,
    institution TEXT,
    "group" TEXT,
    batch_hsc TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    district TEXT,
    postcode TEXT,
    country TEXT,
    permanent_address_line1 TEXT,
    permanent_address_line2 TEXT,
    permanent_city TEXT,
    permanent_district TEXT,
    permanent_postcode TEXT,
    permanent_country TEXT,
    designation TEXT,
    professional_info TEXT,
    profession TEXT,
    marital_status TEXT,
    spouse_name TEXT,
    number_of_children INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add any missing columns to member_details table
DO $$ 
BEGIN
    -- Add father_name column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'member_details' AND column_name = 'father_name'
    ) THEN
        ALTER TABLE member_details ADD COLUMN father_name TEXT;
    END IF;

    -- Add mother_name column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'member_details' AND column_name = 'mother_name'
    ) THEN
        ALTER TABLE member_details ADD COLUMN mother_name TEXT;
    END IF;

    -- Add institution column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'member_details' AND column_name = 'institution'
    ) THEN
        ALTER TABLE member_details ADD COLUMN institution TEXT;
    END IF;

    -- Add group column if it doesn't exist (note: group is a reserved keyword, so we use quotes)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'member_details' AND column_name = 'group'
    ) THEN
        ALTER TABLE member_details ADD COLUMN "group" TEXT;
    END IF;

    -- Add batch_hsc column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'member_details' AND column_name = 'batch_hsc'
    ) THEN
        ALTER TABLE member_details ADD COLUMN batch_hsc TEXT;
    END IF;

    -- Add profession column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'member_details' AND column_name = 'profession'
    ) THEN
        ALTER TABLE member_details ADD COLUMN profession TEXT;
    END IF;

    -- Add marital_status column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'member_details' AND column_name = 'marital_status'
    ) THEN
        ALTER TABLE member_details ADD COLUMN marital_status TEXT;
    END IF;

    -- Add spouse_name column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'member_details' AND column_name = 'spouse_name'
    ) THEN
        ALTER TABLE member_details ADD COLUMN spouse_name TEXT;
    END IF;

    -- Add number_of_children column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'member_details' AND column_name = 'number_of_children'
    ) THEN
        ALTER TABLE member_details ADD COLUMN number_of_children INTEGER;
    END IF;
END $$;

-- =====================================================
-- INDEXES FOR BETTER PERFORMANCE
-- =====================================================

-- Create indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_batch ON users(batch);
CREATE INDEX IF NOT EXISTS idx_users_is_approved ON users(is_approved);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_member_details_user_id ON member_details(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on users table (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on member_details table (if not already enabled)
ALTER TABLE member_details ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Anyone can insert users (for registration)" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;

DROP POLICY IF EXISTS "Users can view their own member details" ON member_details;
DROP POLICY IF EXISTS "Users can update their own member details" ON member_details;
DROP POLICY IF EXISTS "Anyone can insert member details (for registration)" ON member_details;
DROP POLICY IF EXISTS "Admins can view all member details" ON member_details;
DROP POLICY IF EXISTS "Admins can update all member details" ON member_details;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Anyone can insert users (for registration)" ON users
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all users" ON users
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Create RLS policies for member_details table
CREATE POLICY "Users can view their own member details" ON member_details
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own member details" ON member_details
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert member details (for registration)" ON member_details
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view all member details" ON member_details
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all member details" ON member_details
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- VALIDATION CONSTRAINTS
-- =====================================================

-- Add check constraints for data validation (if needed)
DO $$ 
BEGIN
    -- Add constraint to ensure gender is valid
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_gender_check'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_gender_check 
        CHECK (gender IN ('Male', 'Female', 'Other') OR gender IS NULL);
    END IF;

    -- Add constraint to ensure role is valid
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_role_check'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_role_check 
        CHECK (role IN ('admin', 'member') OR role IS NULL);
    END IF;

    -- Add constraint to ensure marital_status is valid
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'member_details_marital_status_check'
    ) THEN
        ALTER TABLE member_details ADD CONSTRAINT member_details_marital_status_check 
        CHECK (marital_status IN ('Single', 'Married', 'Divorced', 'Widowed') OR marital_status IS NULL);
    END IF;
END $$;

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

-- Run this to verify all columns are properly set up
SELECT 
    'Users Table Columns' as check_type,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

SELECT 
    'Member Details Table Columns' as check_type,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'member_details' 
ORDER BY ordinal_position;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$ 
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Registration validation setup completed!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'All required columns have been added/verified.';
    RAISE NOTICE 'Row Level Security policies have been set up.';
    RAISE NOTICE 'Indexes have been created for better performance.';
    RAISE NOTICE 'Data validation constraints have been added.';
    RAISE NOTICE '==============================================';
END $$;

