-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies

BEGIN;
SELECT plan(7);

-- start includes
\include /tmp/supabase/functions/is_company_member.sql
\include /tmp/supabase/policies/campaigns_all.policy.sql
-- end includes

-- make sure everything's available
SELECT has_function('is_company_member');
SELECT tests.rls_enabled('public', 'campaigns');
SELECT policy_cmd_is('campaigns', 'campaigns_all', 'all');
-- Because we confirm here that the rule applies to all, we only need to test SELECT.

-- Test anonymous
SELECT tests.clear_authentication();

SELECT
  is((
    SELECT company_id
    FROM campaigns
    WHERE id = (SELECT id FROM companies WHERE name = 'Blue Moonlight Stream Enterprises')
  ),
  null,
  'Anonymous user CANNOT select other campaigns'
  );

-- test employee
SELECT tests.authenticate_as('christopher.david.thompson@blue-moonlight-stream.com');
SELECT is(
  (
    SELECT name
    FROM campaigns
    WHERE company_id = (SELECT id FROM companies WHERE name = 'Blue Moonlight Stream Enterprises')
  ),
  'Beauty for All Skin Tones',
  'Employee CAN select own company campaigns'
);

SELECT is(
  (
    SELECT name
    FROM campaigns
    WHERE company_id = (SELECT id FROM companies WHERE name = 'Relay Club')
  ),
  null,
  'Employee CANNOT select other company campaigns'
);

-- test staff user
SELECT tests.authenticate_as('jacob@relay.club');
SELECT is(
  (
    SELECT name
    FROM campaigns
    WHERE company_id = (SELECT id FROM companies WHERE name = 'Blue Moonlight Stream Enterprises')
  ),
  'Beauty for All Skin Tones',
  'Employee CAN select own company campaigns'
);

SELECT * FROM finish(); -- end test
ROLLBACK;
