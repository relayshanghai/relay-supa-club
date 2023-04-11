-- Only allow inserting of profiles by the service key account
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_insert ON profiles;

DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;

CREATE POLICY profiles_insert ON profiles FOR INSERT
WITH CHECK (FALSE);
