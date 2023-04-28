-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies

BEGIN;
SELECT plan(6);

-- start includes
\include /tmp/supabase/functions/is_company_member.sql
\include /tmp/supabase/policies/companies_select.policy.sql
-- end includes

-- make sure everything's available
SELECT has_function('is_company_member');
SELECT tests.rls_enabled('public', 'companies');
SELECT policy_cmd_is('companies', 'companies_insert', 'insert');

PREPARE insert_company AS
SELECT * FROM tests.create_company('Test corp', 'https://test.club');

-- Test an anonymous
SELECT tests.clear_authentication();

SELECT
  throws_ok(
    'insert_company',
    null,
    'Anonymous CANNOT insert into companies'
  );

-- Test basic user
SELECT tests.authenticate_as('christopher.david.thompson@blue-moonlight-stream.com');

SELECT
  throws_ok(
    'insert_company',
    null,
    'Authenticated user CANNOT insert into companies'
  );

-- Test staff user
SELECT tests.authenticate_as('jacob@relay.club');

SELECT
  throws_ok(
    'insert_company',
    null,
    'Relay employee CANNOT insert into companies'
  );

SELECT * FROM finish(); -- end test
ROLLBACK;
