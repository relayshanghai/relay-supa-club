-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies

BEGIN;
SELECT plan(5);

SELECT
  results_eq($$ SELECT website FROM companies WHERE name = 'Relay Club'; $$, $$ SELECT 'https://relay.club'; $$, 'Has Relay Club company');
SELECT
  results_eq($$ SELECT website FROM companies WHERE name = 'Blue Moonlight Stream Enterprises'; $$, $$ SELECT 'https://blue-moonlight-stream.com'; $$, 'Has Blue Moonlight Stream Enterprises company');
SELECT
  results_eq($$ SELECT first_name, last_name, email, user_role FROM profiles WHERE email = 'william.edward.douglas@blue-moonlight-stream.com'; $$, $$ SELECT 'William Edward', 'Douglas', 'william.edward.douglas@blue-moonlight-stream.com', 'company_owner'; $$, 'Has company_owner user');
SELECT
  results_eq($$ SELECT first_name, last_name, email, user_role FROM profiles WHERE email = 'christopher.david.thompson@blue-moonlight-stream.com'; $$, $$ SELECT 'Christopher David', 'Thompson', 'christopher.david.thompson@blue-moonlight-stream.com', 'company_teammate'; $$, 'Has company_teammate user');
SELECT
  results_eq($$ SELECT first_name, last_name, email, user_role FROM profiles WHERE email = 'jacob@relay.club'; $$, $$ SELECT 'Jacob', 'Cool', 'jacob@relay.club', 'relay_employee'; $$, 'Has relay_staff user');

SELECT * FROM finish();
ROLLBACK;
