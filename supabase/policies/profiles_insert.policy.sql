DROP POLICY IF EXISTS profiles_insert ON profiles;

CREATE POLICY profiles_insert
ON profiles
FOR INSERT
WITH
  CHECK (FALSE);
