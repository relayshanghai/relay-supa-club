-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies
BEGIN;
SELECT plan(4);

-- start includes
\include /tmp/supabase/functions/is_employee.sql
-- end includes

SELECT has_function('relay_is_employee');

-- test anonymous
  SELECT tests.clear_authentication();
  SELECT is(
    relay_is_employee(),
    null,
    'Anonymous IS NOT a Relay employee'
  );

-- test relay user
  SELECT tests.authenticate_as('jacob@relay.club');
  SELECT is(
    relay_is_employee(),
    true,
    'jacob@relay.club IS a Relay employee'
  );


-- test basic user
  SELECT tests.authenticate_as('owner@email.com');
  SELECT is(
    relay_is_employee(),
    false,
    'owner@email.com IS NOT a Relay employee'
  );


SELECT * FROM finish();
ROLLBACK;

