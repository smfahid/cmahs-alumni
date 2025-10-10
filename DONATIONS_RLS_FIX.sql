-- Fix RLS policies for donations table to allow admin operations

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public to read donations" ON donations;
DROP POLICY IF EXISTS "Allow authenticated users to insert donations" ON donations;
DROP POLICY IF EXISTS "Allow admins to insert donations" ON donations;
DROP POLICY IF EXISTS "Allow admins to update donations" ON donations;
DROP POLICY IF EXISTS "Allow admins to delete donations" ON donations;
DROP POLICY IF EXISTS "Allow admins full access to donations" ON donations;

-- Enable RLS on donations table
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read donations (public view)
CREATE POLICY "Allow public to read donations"
ON donations
FOR SELECT
TO public
USING (true);

-- Allow any authenticated user to insert donations (for public donation form AND admin)
CREATE POLICY "Allow authenticated users to insert donations"
ON donations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow admins to do everything (update and delete)
CREATE POLICY "Allow admins full access to donations"
ON donations
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND UPPER(users.role) = 'ADMIN'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND UPPER(users.role) = 'ADMIN'
  )
);

