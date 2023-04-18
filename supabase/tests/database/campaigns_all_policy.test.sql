-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies

BEGIN;
SELECT plan(3);

-- start includes
\include /tmp/supabase/functions/is_company_member.sql
\include /tmp/supabase/policies/campaigns_all.policy.sql
-- end includes

-- make sure everything's available
SELECT has_function('is_company_member');
SELECT tests.rls_enabled('public', 'campaigns');
SELECT policy_cmd_is('campaigns', 'campaigns_all', 'all');

-- Test anonymous
SELECT tests.clear_authentication();

-- TODO: test when campaigns seed is ready

-- SELECT
--     is(
--         (
--             SELECT company_id
--             FROM campaigns
--             WHERE id = tests.get_supabase_uid('owner@email.com')
--         ),
--         null,
--         'Anonymous user CANNOT select other campaigns'
--     );

-- -- test employee
-- SELECT tests.authenticate_as('employee@email.com');

-- SELECT is(
--     is_company_member(),
--     false,
--     'Authenticated user IS NOT a relay employee'
-- );
-- SELECT is(
--     (
--         SELECT company_id
--         FROM campaigns
--         WHERE company_id = tests.get_supabase_uid('employee@email.com')
--     ),
--     'company_teammate',
--     'Employee CAN select own profile'
-- );
-- SELECT is(
--     (
--         SELECT user_role
--         FROM campaigns
--         WHERE id = tests.get_supabase_uid('owner@email.com')
--     ),
--     null,
--     'Employee CANNOT select other campaigns'
-- );

-- -- test staff user
-- SELECT tests.authenticate_as('jacob@relay.club');
-- SELECT is(
--     is_relay_employee(),
--     true,
--     'Authenticated user IS a Relay employee'
-- );
-- SELECT is(
--     (
--         SELECT user_role
--         FROM campaigns
--         WHERE id = tests.get_supabase_uid('jacob@relay.club')
--     ),
--     'relay_employee',
--     'Relay employee CAN select own profile'
-- );
-- SELECT is(
--     (
--         SELECT user_role
--         FROM campaigns
--         WHERE id = tests.get_supabase_uid('employee@email.com')
--     ),
--     'company_teammate',
--     'Relay employee CAN select other employee campaigns'
-- );
-- SELECT is(
--     (
--         SELECT user_role
--         FROM campaigns
--         WHERE id = tests.get_supabase_uid('owner@email.com')
--     ),
--     'company_owner',
--     'Relay employee CAN select company owner profile'
-- );

SELECT * FROM finish(); -- end test
ROLLBACK;
