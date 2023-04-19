-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies

BEGIN;
SELECT plan(11);

-- start includes
\include /tmp/supabase/functions/is_employee.sql
\include /tmp/supabase/policies/profiles_select.policy.sql
-- end includes

-- make sure everything's available
SELECT has_function('is_relay_employee');
SELECT tests.rls_enabled('public', 'profiles');
SELECT policy_cmd_is('profiles', 'profiles_select', 'select');

-- Test anonymous
SELECT tests.clear_authentication();

SELECT
  is(
    (SELECT user_role FROM profiles WHERE id = tests.get_supabase_uid('owner@email.com')),
    null,
    'Anonymous user CANNOT select other profiles'
  );

-- test employee
SELECT tests.authenticate_as('employee@email.com');

SELECT is(
  is_relay_employee(),
  false,
  'Authenticated user IS NOT a relay employee'
);
SELECT is(
  (SELECT user_role FROM profiles WHERE id = tests.get_supabase_uid('employee@email.com')),
  'company_teammate',
  'Employee CAN select own profile'
);
SELECT is(
  (SELECT user_role FROM profiles WHERE id = tests.get_supabase_uid('owner@email.com')),
  null,
  'Employee CANNOT select other profiles'
);

-- test staff user
SELECT tests.authenticate_as('jacob@relay.club');
SELECT is(
  is_relay_employee(),
  true,
  'Authenticated user IS a Relay employee'
);
SELECT is(
  (SELECT user_role FROM profiles WHERE id = tests.get_supabase_uid('jacob@relay.club')),
  'relay_employee',
  'Relay employee CAN select own profile'
);
SELECT is(
  (SELECT user_role FROM profiles WHERE id = tests.get_supabase_uid('employee@email.com')),
  'company_teammate',
  'Relay employee CAN select other employee profiles'
);
SELECT is(
  (SELECT user_role FROM profiles WHERE id = tests.get_supabase_uid('owner@email.com')),
  'company_owner',
  'Relay employee CAN select company owner profile'
);

SELECT * FROM finish(); -- end test
ROLLBACK;
