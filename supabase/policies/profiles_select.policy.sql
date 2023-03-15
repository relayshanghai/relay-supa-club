CREATE POLICY profiles_select
ON profiles
FOR SELECT
USING (
    id = auth.uid() OR relay_is_employee()
);
