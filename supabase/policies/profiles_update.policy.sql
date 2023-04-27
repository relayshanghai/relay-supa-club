-- Do not allow any updates on profiles table. 
-- Only the service key account can update profiles.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_update ON profiles;

CREATE POLICY profiles_update ON profiles FOR UPDATE
USING (FALSE);
