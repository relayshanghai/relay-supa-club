ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_policy ON public.profiles;

-- in USING, id is the queried (existing) profile id
-- auth.uid() is provided by supabase from the auth token
-- to see whether USING vs WITH CHECK is using the old or new row see Table 287 at https://www.postgresql.org/docs/current/sql-createpolicy.html
-- in WITH CHEC K, id will be the profile id of the new row (that you are trying to update or insert)
CREATE POLICY profiles_policy on public.profiles FOR ALL USING (
  id = auth.uid ()
  OR (
    SELECT
      user_role
    FROM
      public.profiles
    WHERE
      id = auth.uid ()
  ) = 'relay_employee'
)
WITH
  CHECK (
    (
      SELECT
        user_role
      FROM
        public.profiles
      WHERE
        id = auth.uid ()
    ) = user_role
    AND (
      SELECT
        company_id
      FROM
        public.profiles
      WHERE
        id = auth.uid ()
    ) = company_id
  );