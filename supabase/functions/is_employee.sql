-- Do not remove relay_* prefix
CREATE
OR REPLACE FUNCTION relay_is_employee () RETURNS TEXT LANGUAGE plpgsql AS $$
  BEGIN
  RETURN (
      SELECT
        user_role
      FROM
        profiles
      WHERE
        id = auth.uid ()
    ) = 'relay_employee';
  END;
$$;