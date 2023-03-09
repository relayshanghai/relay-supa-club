BEGIN;

SELECT
  plan (1);

-- only one statement to run
SELECT
  has_column ('auth', 'users', 'id', 'id should exist');

SELECT
  *
FROM
  finish ();

ROLLBACK;