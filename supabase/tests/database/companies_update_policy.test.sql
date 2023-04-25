-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies

BEGIN;
SELECT plan(8);

-- start includes
\include /tmp/supabase/functions/is_company_member.sql
\include /tmp/supabase/policies/companies_select.policy.sql
-- end includes

-- make sure everything's available
SELECT has_function('is_company_member');
SELECT tests.rls_enabled('public', 'companies');
SELECT policy_cmd_is('companies', 'companies_update', 'update');

SELECT tests.create_company('test-corp', 'test-corp.com');

PREPARE update_others AS
update companies
SET name = 'test-corp-updated'
WHERE name = 'test-corp'
RETURNING name;

PREPARE update_own AS
update  companies
SET name = 'updated-name'
WHERE name ='Blue Moonlight Stream Enterprises'
RETURNING name;

PREPARE update_own_relay AS
update  companies
SET name = 'updated-name'
WHERE name = 'Relay Club'
RETURNING name;

SAVEPOINT p2;

-- Test anonymous
SELECT tests.clear_authentication();

SELECT
  is_empty(
    'update_others',
    'Anonymous user CANNOT update other company'
  );

ROLLBACK TO SAVEPOINT p2;

-- Test basic user
SELECT tests.authenticate_as('christopher.david.thompson@blue-moonlight-stream.com');

SELECT
  is_empty(
    'update_others',
    'Authenticated user CANNOT update other company'
  );

SELECT
  is_empty(
    'update_own',
    'Authenticated user CANNOT update own company'
  );

ROLLBACK TO SAVEPOINT p2;

-- Test staff user
SELECT tests.authenticate_as('jacob@relay.club');

SELECT
  is_empty(
    'update_others',
    'Relay employee CANNOT update other company'
  );

SELECT
  is_empty(
    'update_own_relay',
    'Relay employee CANNOT update own company'
  );

ROLLBACK TO SAVEPOINT p2;

SELECT * FROM finish();
ROLLBACK;
