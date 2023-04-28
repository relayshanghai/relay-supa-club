BEGIN;
SELECT plan(7);

-- start includes
\include /tmp/supabase/functions/is_company_member.sql
\include /tmp/supabase/policies/companies_select.policy.sql
-- end includes

-- make sure everything's available
SELECT has_function('is_company_member');
SELECT tests.rls_enabled('public', 'companies');
SELECT policy_cmd_is('companies', 'companies_select', 'select');

-- Test anonymous
SELECT tests.clear_authentication();
SELECT is(
  (
    SELECT name
    FROM companies
    WHERE id = (SELECT id FROM companies WHERE name = 'Blue Moonlight Stream Enterprises')
  ),
  null,
  'Anonymous user CANNOT select other companies'
);

-- test employee
SELECT tests.authenticate_as('christopher.david.thompson@blue-moonlight-stream.com');
SELECT is(
  (
    SELECT name
    FROM companies
    WHERE id = (SELECT id FROM companies WHERE name = 'Blue Moonlight Stream Enterprises')
  ),
  'Blue Moonlight Stream Enterprises',
  'Employee CAN select own company'
);
SELECT is(
  (
    SELECT name
    FROM companies
    WHERE id = (SELECT id FROM companies WHERE name = 'Relay Club')
  ),
  null,
  'Employee CANNOT select other company'
);

-- test staff user
SELECT tests.authenticate_as('jacob@relay.club');
SELECT is(
  (
    SELECT name
    FROM companies
    WHERE id = (SELECT id FROM companies WHERE name = 'Blue Moonlight Stream Enterprises')
  ),
  'Blue Moonlight Stream Enterprises',
  'Staff user CAN select other company'
);

SELECT * FROM finish();
ROLLBACK;
