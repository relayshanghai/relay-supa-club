SELECT diag('<-------------------------------------------------------------------------------- [TESTS END]'::TEXT);

-- suppress noise, we want it clean
SET client_min_messages = warning;

-- clean up usebasejump test helpers
DROP FUNCTION IF EXISTS tests.create_supabase_user(text, text, text);
DROP FUNCTION IF EXISTS tests.get_supabase_uid(text);
DROP FUNCTION IF EXISTS tests.get_supabase_user(text);
DROP FUNCTION IF EXISTS tests.authenticate_as(text);
DROP FUNCTION IF EXISTS tests.clear_authentication;
DROP FUNCTION IF EXISTS tests.rls_enabled(text);
DROP FUNCTION IF EXISTS tests.rls_enabled(text, text);

-- for some reason, drop function does not seem to work. force it with cascade
DROP SCHEMA tests CASCADE;

-- make it noisy again!
SET client_min_messages = notice;

BEGIN;
    SELECT plan(6);
    SELECT diag('Remove usebasejump supabase helpers');
    SELECT hasnt_function('tests', 'create_supabase_user');
    SELECT hasnt_function('tests', 'get_supabase_uid');
    SELECT hasnt_function('tests', 'get_supabase_user');
    SELECT hasnt_function('tests', 'authenticate_as');
    SELECT hasnt_function('tests', 'clear_authentication');
    SELECT hasnt_function('tests', 'rls_enabled');
    SELECT * FROM finish();
ROLLBACK;
