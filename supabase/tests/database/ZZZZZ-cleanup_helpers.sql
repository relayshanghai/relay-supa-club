-- clean up usebasejump test helpers
DROP FUNCTION IF EXISTS tests.create_supabase_user();
DROP FUNCTION IF EXISTS tests.get_supabase_uid();
DROP FUNCTION IF EXISTS tests.get_supabase_user();
DROP FUNCTION IF EXISTS tests.authenticate_as();
DROP FUNCTION IF EXISTS tests.clear_authentication();
DROP FUNCTION IF EXISTS tests.rls_enabled();

-- for some reason, drop function does not seem to work. force it with cascade
DROP SCHEMA tests CASCADE;

BEGIN;
    select plan(6);
    select hasnt_function('tests', 'create_supabase_user');
    select hasnt_function('tests', 'get_supabase_uid');
    select hasnt_function('tests', 'get_supabase_user');
    select hasnt_function('tests', 'authenticate_as');
    select hasnt_function('tests', 'clear_authentication');
    select hasnt_function('tests', 'rls_enabled');
    select * from finish();
ROLLBACK;
