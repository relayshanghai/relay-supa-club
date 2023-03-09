BEGIN;

SELECT
  plan (1);

SELECT
  tests.create_test_users ();

SELECT
  IS (
    (
      SELECT
        user_role
      FROM
        profiles
      WHERE
        id = tests.get_supabase_uid ('owner')
    ),
    'company_owner'
  );

SELECT
  *
FROM
  finish ();

ROLLBACK;