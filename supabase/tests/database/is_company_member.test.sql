-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies
BEGIN;
SELECT plan(4);

-- start includes
\include /tmp/supabase/functions/is_company_member.sql
-- end includes

SELECT has_function('is_company_member');

-- test anonymous
SELECT tests.clear_authentication();
SELECT is(
  is_company_member((SELECT id FROM companies WHERE name = 'Blue Moonlight Stream Enterprises')),
  null,
  'Anonymous IS NOT a Blue Moonlight Stream Enterprises member'
);
-- test basic user

SELECT tests.authenticate_as('christopher.david.thompson@blue-moonlight-stream.com');
SELECT is(
  is_company_member((SELECT id FROM companies WHERE name = 'Blue Moonlight Stream Enterprises')),
  true,
  'christopher.david.thompson@blue-moonlight-stream.com IS a Blue Moonlight Stream Enterprises member'
);

-- test relay user
SELECT tests.authenticate_as('jacob@relay.club');
SELECT is(
  is_company_member((SELECT id FROM companies WHERE name = 'Blue Moonlight Stream Enterprises')),
  false,
  'jacob@relay.club (relay employee) IS still NOT a Blue Moonlight Stream Enterprises member'
);


SELECT * FROM finish();
ROLLBACK;
