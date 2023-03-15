CREATE POLICY profiles_insert
ON profiles
FOR INSERT
WITH
  CHECK (FALSE);
