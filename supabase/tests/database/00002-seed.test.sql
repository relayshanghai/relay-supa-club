-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies

BEGIN;
SELECT plan(9);

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

SELECT
  results_eq($$ SELECT product_name FROM campaigns WHERE company_id = (SELECT company_id FROM profiles WHERE email = 'william.edward.douglas@blue-moonlight-stream.com'); $$, $$ SELECT 'Shade Range Makeup'; $$, 'Has Shade Range Makeup campaign');

SELECT
  results_eq($$ SELECT product_name FROM campaigns WHERE company_id = (SELECT company_id FROM profiles WHERE email = 'jacob@relay.club'); $$, $$ SELECT 'NeonX Gaming Console'; $$, 'Has NeonX Gaming Console campaign');

SELECT
  results_eq($$ SELECT fullname FROM campaign_creators WHERE campaign_id = (SELECT id FROM campaigns WHERE product_name = 'Shade Range Makeup'); $$, $$ SELECT 'Greg Renko'; $$, 'Has Greg Renko campaign creator');

SELECT
  results_eq($$ SELECT fullname FROM campaign_creators WHERE campaign_id = (SELECT id FROM campaigns WHERE product_name = 'NeonX Gaming Console'); $$, $$ SELECT 'Yousef Gaming'; $$, 'Has Yousef Gaming campaign creator');

SELECT * FROM finish();
ROLLBACK;
