-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies

BEGIN;
SELECT plan(9);

-- start includes
\include /tmp/supabase/functions/is_employee.sql
\include /tmp/supabase/policies/profiles_select.policy.sql
\include /tmp/supabase/policies/profiles_delete.policy.sql
-- end includes

DO $$
  DECLARE
    company_id uuid;
    company_owner_id uuid;
    company_relay_id uuid;
    user_id uuid;
  BEGIN
    company_relay_id := tests.create_company('relay.club', 'https://relay.club');
    company_id := tests.create_company('company a', 'https://company-a.com');

    PERFORM tests.create_profile(
      'owner@email.com',
      'John',
      'Doe',
      'company_owner',
      company_id
    );

    PERFORM tests.create_profile(
      'employee@email.com',
      'Abraham',
      'David',
      'company_teammate',
      company_id
    );

    PERFORM tests.create_profile(
      'employee2@email.com',
      'Carl',
      'Everlong',
      'company_teammate',
      company_id
    );

    user_id := tests.create_profile(
      'jacob@relay.club',
      'Jacob',
      'Awesome',
      'relay_employee',
      company_relay_id
    );

    PERFORM tests.set_var('company_relay_id', company_relay_id);
  END;
$$ LANGUAGE plpgsql;

-- make sure everything's available
SELECT has_function('relay_is_employee');
SELECT tests.rls_enabled('profiles');
SELECT policy_cmd_is('profiles', 'profiles_select', 'select');
SELECT policy_cmd_is('profiles', 'profiles_delete', 'delete');

PREPARE delete_others AS
  DELETE FROM profiles
  WHERE email = 'owner@email.com'
  RETURNING email;

PREPARE delete_own AS
  DELETE FROM profiles
  WHERE email = 'employee@email.com'
  RETURNING email;

PREPARE delete_own_relay AS
  DELETE FROM profiles
  WHERE email = 'jacob@relay.club'
  RETURNING email;

SAVEPOINT p2;

-- Test anonymous
  SELECT tests.clear_authentication();

  SELECT
    is_empty(
      'delete_others',
      'Anonymous user CANNOT delete other profiles'
    );

  ROLLBACK TO SAVEPOINT p2;

-- Test basic user
  SELECT tests.authenticate_as('employee@email.com');

  SELECT
    is_empty(
      'delete_others',
      'Authenticated user CANNOT delete other profiles'
    );

  SELECT
    is_empty(
      'delete_own',
      'Authenticated user CANNOT delete own profile'
    );

  ROLLBACK TO SAVEPOINT p2;

-- Test staff user
  SELECT tests.authenticate_as('jacob@relay.club');

  SELECT
    is_empty(
      'delete_others',
      'Relay employee CANNOT delete other profiles'
    );

  SELECT
    is_empty(
      'delete_own_relay',
      'Relay employee CANNOT delete own profile'
    );

  ROLLBACK TO SAVEPOINT p2;

SELECT * FROM finish();
ROLLBACK;
