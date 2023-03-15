-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies
BEGIN;
SELECT plan(3);

-- start includes
\include /tmp/supabase/functions/is_employee.sql
-- end includes

CREATE TEMP TABLE test_vars (name TEXT, value TEXT);

-- temporary manual seed
DO $$
  DECLARE
    company_id uuid;
    company_owner_id uuid;
    company_relay_id uuid;
    user_id uuid;
    _row RECORD;
  BEGIN
    company_relay_id := tests.create_company('relay.club', 'https://relay.club');
    -- company_id := tests.create_company('company a', 'https://company-a.com');

    company_owner_id := tests.create_profile(
      'owner@email.com',
      'John',
      'Doe',
      'owner',
      company_id
    );

    user_id := tests.create_profile(
      'jacob@relay.club',
      'Jacob',
      'Awesome',
      'relay_employee',
      company_relay_id
    );

    -- SELECT tests.get_profiles() INTO _row;
    -- PERFORM tests.logg(to_json(_row));

    INSERT INTO test_vars values ('company_relay_id', company_relay_id);
  END;
  $$ LANGUAGE plpgsql;

-- check if function exists
SELECT has_function('relay_is_employee');

-- authenticate as the company owner
SELECT tests.authenticate_as('jacob@relay.club');

-- check if relay employee
SELECT ok(relay_is_employee());

-- SELECT tests.clear_authentication();
SELECT tests.authenticate_as('owner@email.com');
SELECT is(relay_is_employee(), false);

SELECT * FROM finish();
ROLLBACK;

