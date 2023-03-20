-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies

BEGIN;
SELECT plan(5);

SELECT results_eq($$ SELECT website FROM companies WHERE name = 'relay.club'; $$, $$ SELECT 'http://relay.club'; $$, 'Has relay.club company');
SELECT results_eq($$ SELECT website FROM companies WHERE name = 'foo.bar'; $$, $$ SELECT 'http://foo.bar'; $$, 'Has foo.bar company');
SELECT results_eq($$ SELECT first_name, last_name, email, role FROM profiles WHERE email = 'owner@email.com'; $$, $$ SELECT 'John', 'Doe', 'owner@email.com', 'company_owner'; $$, 'Has company_owner user');
SELECT results_eq($$ SELECT first_name, last_name, email, role FROM profiles WHERE email = 'employee@email.com'; $$, $$ SELECT 'Abraham', 'David', 'employee@email.com', 'company_teammate'; $$, 'Has company_teammate user');
SELECT results_eq($$ SELECT first_name, last_name, email, role FROM profiles WHERE email = 'jacob@relay.club'; $$, $$ SELECT 'Jacob', 'Cool', 'jacob@relay.club', 'relay_employee'; $$, 'Has relay_staff user');

SELECt * FROM finish();
ROLLBACK;
