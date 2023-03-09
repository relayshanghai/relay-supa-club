BEGIN;

SELECT
  plan (1);

SELECT
  tests.create_supabase_user ('test_owner', 'owner@test.com');

SELECT
  ok (
    (
      SELECT
        email
      FROM
        profiles
      WHERE
        id = tests.get_supabase_uid ('test_owner') IS NOT NULL
    ) = 'owner@test.com'
  );

SELECT
  *
FROM
  finish ();

ROLLBACK;