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
    is_company_member((SELECT id FROM companies WHERE name = 'foo.bar')),
    null,
    'Anonymous IS NOT a foo.bar member'
);

-- test relay user
SELECT tests.authenticate_as('employee@email.com');
SELECT is(
    is_company_member((SELECT id FROM companies WHERE name = 'foo.bar')),
    true,
    'jacob@relay.club IS a foo.bar member'
);


-- test basic user
SELECT tests.authenticate_as('jacob@relay.club');
SELECT is(
    is_company_member((SELECT id FROM companies WHERE name = 'foo.bar')),
    false,
    'jacob@relay.club (relay employee) IS still NOT a foo.bar member'
);


SELECT * FROM finish();
ROLLBACK;
