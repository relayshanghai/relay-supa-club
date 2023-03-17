DROP POLICY IF EXISTS profiles_delete ON profiles;

CREATE POLICY profiles_delete
ON profiles
FOR DELETE
USING (FALSE);
