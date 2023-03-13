CREATE POLICY profiles_policy_select ON profiles FOR
SELECT
    USING (
        id = auth.uid ()
        OR is_relay_employee ()
    );