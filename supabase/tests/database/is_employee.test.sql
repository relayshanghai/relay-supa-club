-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies
BEGIN;

\include /tmp/supabase/functions/is_employee.sql;

SELECT
  plan (1);

SELECT
  tests.create_test_users ();

SELECT
  tests.authenticate_as ('owner');

  SELECT  has_function( 'public', 'relay_is_employee');



SELECT
  *
FROM
  finish ();

-- end test
ROLLBACK;