ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select ON profiles;
DROP POLICY IF EXISTS profiles_policy ON profiles; -- temp fix, snapshot currently

CREATE POLICY profiles_select
ON profiles
FOR SELECT
USING (
    id = auth.uid() OR relay_is_employee()
);
