-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies

BEGIN;
SELECT plan(6);

-- start includes
\include /tmp/supabase/functions/is_employee.sql
\include /tmp/supabase/policies/profiles_insert.policy.sql
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
SELECT policy_cmd_is('profiles', 'profiles_insert', 'insert');

PREPARE insert_profile AS
  SELECT * FROM tests.create_profile(
    'fake-owner@email.com',
    'John',
    'Fake',
    'company_owner',
    (SELECT tests.get_var('company_relay_id'::TEXT))::UUID
  );

-- Test an anonymous
  SELECT tests.clear_authentication();

  SELECT
    throws_ok(
      'insert_profile',
      null,
      'Anonymous CANNOT insert into profiles'
    );

-- Test staff user
  SELECT tests.authenticate_as('employee@email.com');

  SELECT
    throws_ok(
      'insert_profile',
      null,
      'Authenticated user CANNOT insert into profiles'
    );

-- Test staff user
  SELECT tests.authenticate_as('jacob@relay.club');

  SELECT
    throws_ok(
      'insert_profile',
      null,
      'Relay employee CANNOT insert into profiles'
    );

SELECT * FROM finish(); -- end test
ROLLBACK;
