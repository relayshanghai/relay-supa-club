-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies
BEGIN;
SELECT plan(9);
-- start includes
\include /tmp/supabase/functions/is_employee.sql
\include /tmp/supabase/policies/profiles_select.policy.sql
\include /tmp/supabase/policies/profiles_update.policy.sql
-- end includes

-- make sure everything's available
SELECT has_function('is_relay_employee');
SELECT tests.rls_enabled('public', 'profiles');
SELECT policy_cmd_is('profiles', 'profiles_select', 'select');
SELECT policy_cmd_is('profiles', 'profiles_update', 'update');

PREPARE update_others AS
UPDATE profiles
SET email = 'owner-updated@email.com'
WHERE email = 'william.edward.douglas@blue-moonlight-stream.com'
RETURNING email;

PREPARE update_own AS
UPDATE profiles
SET email = 'employee-updated@email.com'
WHERE email = 'christopher.david.thompson@blue-moonlight-stream.com'
RETURNING email;

PREPARE update_own_relay AS
UPDATE profiles
SET email = 'relay-updated@email.com'
WHERE email = 'jacob@relay.club'
RETURNING email;

-- Creates a savepoint we can return to later
-- Note that jumping back to this savepoint will also "revert" successful tests
-- causing pgTap to show this warning: "Looks like you planned X tests but ran Y".
-- This will however still properly "record" failures
-- We will refactor this once proper seeding & prepped statements are done
SAVEPOINT p1;

-- Test anonymous
SELECT tests.clear_authentication();
SELECT is_empty(
  'update_others',
  'Anonymous user CANNOT update other profiles'
);

ROLLBACK TO SAVEPOINT p1;

-- Test basic user
SELECT tests.authenticate_as('christopher.david.thompson@blue-moonlight-stream.com');
SELECT is_empty(
  'update_others',
  'Authenticated user CANNOT update other profiles'
);
SELECT is_empty(
  'update_own',
  'Authenticated user CANNOT update own profile'
);

ROLLBACK TO SAVEPOINT p1;

-- Test staff user
SELECT tests.authenticate_as('jacob@relay.club');
SELECT is_empty(
  'update_others',
  'Relay employee CANNOT update other profiles'
);
SELECT is_empty(
  'update_own_relay',
  'Relay employee CANNOT update own profile'
);

ROLLBACK TO SAVEPOINT p1;
SELECT * FROM finish();
ROLLBACK;
