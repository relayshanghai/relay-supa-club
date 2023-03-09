BEGIN;

SELECT
  plan (1);

SELECT
  IS (
    (
      SELECT
        email
      FROM
        profiles
      WHERE
        id = tests.get_supabase_uid ('test_owner')
    ),
    'owner@test.com',
    'Email inserted correctly'
  );

SELECT
  *
FROM
  finish ();

ROLLBACK;