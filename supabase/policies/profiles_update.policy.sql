-- Allow updates on profiles table if auth is able to select the row
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_update ON profiles;

 -- temp fix for existing policies in the snapshot
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

CREATE POLICY profiles_update
ON profiles
FOR UPDATE
USING (TRUE);
