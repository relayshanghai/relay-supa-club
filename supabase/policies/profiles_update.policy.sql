ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_update ON profiles;

CREATE POLICY profiles_update
ON profiles
FOR UPDATE
USING (TRUE);
