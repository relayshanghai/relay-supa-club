-- Prevent deletes on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_delete ON profiles;

CREATE POLICY profiles_delete
ON profiles
FOR DELETE
USING (FALSE);
