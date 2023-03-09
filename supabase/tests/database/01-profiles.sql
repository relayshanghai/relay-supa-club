BEGIN;

SELECT
  plan (1);

SELECT
  tests.create_supabase_user ('test_owner', 'owner@test.com');

INSERT INTO
  companies (id, NAME)
VALUES
  (uuid_generate_v4 (), 'test company');

INSERT INTO
  profiles (
    id,
    email,
    last_name,
    first_name,
    user_role,
    company_id
  )
VALUES
  (
    tests.get_supabase_uid ('test_owner'),
    'owner@test.com',
    'owner',
    'owner',
    'company_owner',
    (
      SELECT
        id
      FROM
        companies
      WHERE
        NAME = 'test company'
    )
  );

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