-- First, let's see what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'donations';

-- Now let's drop and recreate them properly
DROP POLICY IF EXISTS "Allow public to read donations" ON donations;
DROP POLICY IF EXISTS "Allow authenticated users to insert donations" ON donations;
DROP POLICY IF EXISTS "Allow admins to insert donations" ON donations;
DROP POLICY IF EXISTS "Allow admins to update donations" ON donations;
DROP POLICY IF EXISTS "Allow admins to delete donations" ON donations;
DROP POLICY IF EXISTS "Allow admins full access to donations" ON donations;

-- Enable RLS (if not already enabled)
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read donations (public view)
CREATE POLICY "Allow public to read donations"
ON donations
FOR SELECT
TO public
USING (true);

-- Allow any authenticated user to insert donations
CREATE POLICY "Allow authenticated users to insert donations"
ON donations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow admins to update donations
CREATE POLICY "Allow admins to update donations"
ON donations
FOR UPDATE
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

-- Allow admins to delete donations
CREATE POLICY "Allow admins to delete donations"
ON donations
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND UPPER(users.role) = 'ADMIN'
  )
);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'donations';

