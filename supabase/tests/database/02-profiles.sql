ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_policy ON public.profiles;

-- in USING, id is the queried (existing) profile id
-- auth.uid() is provided by supabase from the auth token
-- to see whether USING vs WITH CHECK is using the old or new row see Table 287 at https://www.postgresql.org/docs/current/sql-createpolicy.html
-- in WITH CHEC K, id will be the profile id of the new row (that you are trying to update or insert)
CREATE POLICY profiles_policy ON public.profiles USING (
  (id = auth.uid ())
  OR (public.is_relay_employee ())
)
WITH
  CHECK (
    (
      (
        SELECT
          user_role
        FROM
          public.profiles
        WHERE
          id = auth.uid ()
      ) = user_role
    )
    AND (
      (
        SELECT
          company_id
        FROM
          public.profiles
        WHERE
          id = auth.uid ()
      ) = company_id
    )
  );

BEGIN;

SELECT
  plan (6);

SELECT
  tests.create_test_users ();

-- Sanity check we have the roles we expect
SELECT
  IS (
    (
      SELECT
        user_role
      FROM
        profiles
      WHERE
        id = tests.get_supabase_uid ('owner')
    ),
    'company_owner'
  );

SELECT
  IS (
    (
      SELECT
        user_role
      FROM
        profiles
      WHERE
        id = tests.get_supabase_uid ('relay-employee')
    ),
    'relay_employee'
  );

SELECT
  IS (
    (
      SELECT
        user_role
      FROM
        profiles
      WHERE
        id = tests.get_supabase_uid ('member')
    ),
    'company_teammate'
  );

--  SELECTs
-- 1. owner can select their own profile
SELECT
  tests.authenticate_as ('owner');

SELECT
  IS (
    (
      SELECT
        first_name
      FROM
        profiles
      WHERE
        id = tests.get_supabase_uid ('owner')
    ),
    'owner-first-name'
  );

-- 2. member can't select owner's profile
SELECT
  tests.authenticate_as ('member');

SELECT
  IS (
    (
      SELECT
        first_name
      FROM
        profiles
      WHERE
        id = tests.get_supabase_uid ('owner')
    ),
    NULL
  );

-- 3. relay employee can select owner's profile
SELECT
  tests.authenticate_as ('relay-employee');

SELECT
  IS (
    (
      SELECT
        first_name
      FROM
        profiles
      WHERE
        id = tests.get_supabase_uid ('owner')
    ),
    'owner-first-name'
  );

SELECT
  *
FROM
  finish ();

ROLLBACK;