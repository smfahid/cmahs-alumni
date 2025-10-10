-- Disable RLS on donations table
-- Since donations are managed by admins and we have app-level protection,
-- we don't need database-level RLS for this table

ALTER TABLE donations DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'donations';

