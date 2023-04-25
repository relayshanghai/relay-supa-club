-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies
BEGIN;
SELECT plan(4);

-- start includes
\include /tmp/supabase/functions/is_company_member_of_campaign.sql
-- end includes

SELECT has_function('is_company_member_of_campaign');

-- test anonymous
SELECT tests.clear_authentication();
SELECT is(
  is_company_member_of_campaign((SELECT id FROM campaigns WHERE product_name = 'Shade Range Makeup')),
  null,
  'Anonymous IS NOT a Blue Moonlight Stream Enterprises member'
);
-- test basic user

SELECT tests.authenticate_as('christopher.david.thompson@blue-moonlight-stream.com');
SELECT is(
  is_company_member_of_campaign((SELECT id FROM campaigns WHERE product_name = 'Shade Range Makeup')),
  true,
  'christopher.david.thompson@blue-moonlight-stream.com IS a Blue Moonlight Stream Enterprises member'
);

-- test relay user
SELECT tests.authenticate_as('jacob@relay.club');
SELECT is(
  is_company_member_of_campaign((SELECT id FROM campaigns WHERE product_name = 'Shade Range Makeup')),
  false,
  'jacob@relay.club (relay employee) IS still NOT a Blue Moonlight Stream Enterprises member'
);


SELECT * FROM finish();
ROLLBACK;
