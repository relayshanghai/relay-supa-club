BEGIN;
SELECT plan(1); -- no. of tests in the file

SELECT has_column(
  'auth',
  'users',
  'id',
  'id should exist'
);

SELECT * FROM finish(); -- end test
ROLLBACK;
