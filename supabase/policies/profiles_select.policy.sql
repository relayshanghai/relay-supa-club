ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select ON profiles;

 -- temp fix for existing policies in the snapshot
DROP POLICY IF EXISTS profiles_policy ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;

CREATE POLICY profiles_select
ON profiles
FOR SELECT
USING (
    id = auth.uid() OR relay_is_employee()
);
