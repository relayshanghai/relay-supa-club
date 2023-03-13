BEGIN;
    select plan(1);
    SELECT ok(true);
    select * from finish();
ROLLBACK;
