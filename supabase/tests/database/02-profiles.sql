BEGIN;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_policy_select ON profiles;

DROP POLICY IF EXISTS profiles_policy_insert ON profiles;

DROP POLICY IF EXISTS profiles_policy_update ON profiles;

DROP POLICY IF EXISTS profiles_policy_delete ON profiles;

-- TODO: move this elsewhere
CREATE
OR REPLACE FUNCTION is_relay_employee () RETURNS BOOLEAN AS $$
DECLARE
  result BOOLEAN DEFAULT FALSE;
BEGIN
  SELECT
    (
      SELECT
        user_role
      FROM
        profiles
      WHERE
        id = auth.uid ()
    ) = 'relay_employee'
  INTO
    result;
  RETURN 
    result;
END;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;

-- SELECT policy - only allow to select own profile or if relay employee superuser
CREATE POLICY profiles_policy_select ON profiles FOR
SELECT
  USING (
    id = auth.uid ()
    OR is_relay_employee ()
  );

-- INSERT policy - do not allow any inserts (profile inserts must be made with the service key client)
CREATE POLICY profiles_policy_insert ON profiles FOR INSERT
WITH
  CHECK (FALSE);

-- DELETE policy - do not allow any deletes (must be made with service key)
CREATE POLICY profiles_policy_delete ON profiles FOR DELETE USING (FALSE);

-- UPDATE policy - do not allow any updates (profile updates must be made with the service key client)
CREATE POLICY profiles_policy_update ON profiles FOR
UPDATE USING (FALSE)
WITH
  CHECK (FALSE);

SELECT
  plan (9);

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

-- INSERTs
SELECT
  tests.clear_authentication ();

SELECT
  throws_ok (
    $$ INSERT INTO profiles (id, email, last_name, first_name, user_role, company_id) VALUES ( uuid_generate_v4 (), 'owner-email', 'name', 'name', 'company_owner', (SELECT id FROM companies WHERE name = 'company1' )); $$,
    'new row violates row-level security policy for table "profiles"'
  );

-- UPDATES 
-- cannot update. Will just return empty
SELECT
  tests.clear_authentication ();

SELECT
  is_empty (
    $$ update profiles set first_name = 'updated by anon' returning first_name $$,
    'anon users cannot update profiles'
  );

SELECT
  tests.authenticate_as ('owner');

SELECT
  is_empty (
    $$ update profiles set first_name = 'updated by owner' returning first_name $$,
    'users cannot update even their own profiles'
  );

SELECT
  *
FROM
  finish ();

SELECT
  truncate_all_tables ('auth');

SELECT
  truncate_all_tables ('public');

ROLLBACK;