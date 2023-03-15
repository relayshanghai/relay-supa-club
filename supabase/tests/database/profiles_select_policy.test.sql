-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies

BEGIN;
SELECT plan(10);

-- start includes
\include /tmp/supabase/functions/is_employee.sql
\include /tmp/supabase/policies/profiles_select.policy.sql
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
  END;
$$ LANGUAGE plpgsql;

-- make sure everything's available
SELECT has_function('relay_is_employee');
SELECT policy_cmd_is('profiles', 'profiles_select', 'select');

-- test employee
SELECT tests.authenticate_as('employee@email.com');
SELECT is(
  relay_is_employee(),
  false,
  'Authenticated user IS NOT a relay employee'
);
SELECT is(
  (SELECT user_role FROM profiles WHERE id = tests.get_supabase_uid('employee@email.com')),
  'company_teammate',
  'Employee CAN select own profile'
);
SELECT is(
  (SELECT user_role FROM profiles WHERE id = tests.get_supabase_uid('employee2@email.com')),
  null,
  'Employee CANNOT select other employee profiles'
);
SELECT is(
  (SELECT user_role FROM profiles WHERE id = tests.get_supabase_uid('owner@email.com')),
  null,
  'Employee CANNOT select company owner profile'
);

-- test relay staff
SELECT tests.authenticate_as('jacob@relay.club');
SELECT is(
  relay_is_employee(),
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
