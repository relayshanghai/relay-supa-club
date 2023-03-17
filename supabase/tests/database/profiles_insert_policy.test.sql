-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies

BEGIN;
SELECT plan(6);

-- start includes
\include /tmp/supabase/functions/is_employee.sql
\include /tmp/supabase/policies/profiles_insert.policy.sql
-- end includes

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

-- Test basic user
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
