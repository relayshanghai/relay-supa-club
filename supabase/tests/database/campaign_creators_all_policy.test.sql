-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies

BEGIN;
SELECT plan(8);

-- start includes
\include /tmp/supabase/functions/is_company_member.sql
\include /tmp/supabase/policies/campaign_creators_all.policy.sql
-- end includes

-- make sure everything's available
SELECT has_function('is_company_member_of_campaign');
SELECT tests.rls_enabled('public', 'campaigns');
SELECT policy_cmd_is('campaign_creators', 'campaign_creators_all', 'all');
-- Because we confirm here that the rule applies to all, we only need to test SELECT.


-- Test anonymous
SELECT tests.clear_authentication();
SELECT is((SELECT fullname FROM campaign_creators WHERE campaign_id = (SELECT id FROM campaigns WHERE product_name = 'Shade Range Makeup')), null, 'anon CANNOT select campaign creators');

-- test user
SELECT tests.authenticate_as('christopher.david.thompson@blue-moonlight-stream.com');
SELECT is(
  (SELECT fullname FROM campaign_creators WHERE campaign_id = (SELECT id FROM campaigns WHERE product_name = 'Shade Range Makeup')),
  'Greg Renko',
  'Employee CAN select own company campaigns'
);

SELECT is(
  (SELECT fullname FROM campaign_creators WHERE campaign_id = (SELECT id FROM campaigns WHERE product_name = 'NeonX Gaming Console')),
  null,
  'Employee CANNOT select other company campaigns'
);

-- test staff user
SELECT tests.authenticate_as('jacob@relay.club');
SELECT is(
  (SELECT fullname FROM campaign_creators WHERE campaign_id = (SELECT id FROM campaigns WHERE product_name = 'NeonX Gaming Console')),
  'Yousef Gaming',
  'Relay employee CAN select own company campaigns'
);

SELECT is(
  (SELECT fullname FROM campaign_creators WHERE campaign_id = (SELECT id FROM campaigns WHERE product_name = 'Shade Range Makeup')),
  'Greg Renko',
  'Relay employee CAN select other company campaigns'
);

SELECT * FROM finish(); -- end test
ROLLBACK;
