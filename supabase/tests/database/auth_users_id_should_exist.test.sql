begin;
select plan(1); -- no. of tests in the file

SELECT has_column(
    'auth',
    'users',
    'id',
    'id should exist'
);

select * from finish(); -- end test
rollback;
