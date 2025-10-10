-- Create RLS policies for donations table

-- Allow everyone to read donations
CREATE POLICY "donations_select_policy"
ON donations
FOR SELECT
USING (true);

-- Allow authenticated users to insert donations
CREATE POLICY "donations_insert_policy"
ON donations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow admins to update donations
CREATE POLICY "donations_update_policy"
ON donations
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND UPPER(users.role) = 'ADMIN'
  )
);

-- Allow admins to delete donations
CREATE POLICY "donations_delete_policy"
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

