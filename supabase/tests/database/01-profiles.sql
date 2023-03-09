BEGIN;

SELECT
  plan (3);

SELECT
  has_table ('profiles');

SELECT
  has_column ('public', 'profiles', 'id', 'id should exist');

SELECT
  has_column (
    'public',
    'profiles',
    'user_id',
    'user_id should exist'
  );

SELECT
  *
FROM
  finish ();

ROLLBACK;