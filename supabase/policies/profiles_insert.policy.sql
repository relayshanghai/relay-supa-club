-- Prevent inserts on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_insert ON profiles;

-- temp fix for existing policies in the snapshot
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;

CREATE POLICY profiles_insert
ON profiles
FOR INSERT
WITH
  CHECK (FALSE);
