-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies

BEGIN;
SELECT plan(25);

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

SELECT results_eq($$ SELECT name from influencers WHERE email = 'alice.anderson@example.com'; $$, $$ SELECT 'Alice Anderson'; $$, 'Has Alice Anderson influencer');

SELECT results_eq($$ SELECT name from influencers WHERE email = 'bob.brown@example.com'; $$, $$ SELECT 'Bob-Recommended Brown'; $$, 'Has Bob Brown influencer');

SELECT results_eq($$ SELECT name from influencers WHERE email = 'charlie.charles@example.com'; $$, $$ SELECT 'Charlie Charles'; $$, 'Has Charlie Charles influencer');
-- based on
-- PERFORM create_influencer_social_profile(
--   'https://instagram.com/alice1',
--   'instagram',
--   _influencer_alice.id,
--   'iqdata_1',
--   'alice1'
-- );
SELECT results_eq($$ SELECT url from influencer_social_profiles where influencer_id = (SELECT id FROM influencers WHERE email = 'alice.anderson@example.com') AND platform = 'instagram'; $$, $$ SELECT 'https://instagram.com/alice1'; $$, 'Has Alice Anderson instagram profile');
--  now based on
-- PERFORM create_influencer_social_profile(
--   'https://instagram.com/bob1',
--   'instagram',
--   _influencer_bob.id,
--   'iqdata_2',    
--   'bob1'
-- );

SELECT results_eq($$ SELECT url from influencer_social_profiles where influencer_id = (SELECT id FROM influencers WHERE email = 'bob.brown@example.com') AND platform = 'instagram'; $$, $$ SELECT 'https://instagram.com/bob1'; $$, 'Has Bob Brown instagram profile');


SELECT results_eq($$ SELECT url from influencer_social_profiles where influencer_id = (SELECT id FROM influencers WHERE email = 'bob.brown@example.com') AND platform = 'youtube'; $$, $$ SELECT 'https://youtube.com/bob2'; $$, 'Has Bob Brown youtube profile');

-- based on 
--   _influencer_post_alice_1 := create_influencer_post(
--     'https://instagram.com/alice/posts/1',
--     _campaign_beauty_for_all.id,
--     _influencer_alice.id,
--     'instagram'
--   );

SELECT results_eq($$ SELECT platform from influencer_posts where influencer_id = (SELECT id FROM influencers WHERE email = 'alice.anderson@example.com') AND url = 'https://instagram.com/alice/posts/1'; $$, $$ SELECT 'instagram'; $$, 'Has Alice Anderson instagram post');

SELECT results_eq($$ SELECT platform from influencer_posts where influencer_id = (SELECT id FROM influencers WHERE email = 'alice.anderson@example.com') AND url = 'https://instagram.com/alice/posts/2'; $$, $$ SELECT 'instagram'; $$, 'Has Alice Anderson instagram post 2');

SELECT results_eq($$ SELECT platform from influencer_posts where influencer_id = (SELECT id FROM influencers WHERE email = 'alice.anderson@example.com') AND url = 'https://instagram.com/alice/posts/3'; $$, $$ SELECT 'instagram'; $$, 'Has Alice Anderson instagram post 3');

SELECT results_eq($$ SELECT platform from influencer_posts where influencer_id = (SELECT id FROM influencers WHERE email = 'bob.brown@example.com') AND url = 'https://instagram.com/bob/posts/1'; $$, $$ SELECT 'instagram'; $$, 'Has Bob Brown instagram post 1');

SELECT results_eq($$ SELECT platform from influencer_posts where influencer_id = (SELECT id FROM influencers WHERE email = 'bob.brown@example.com') AND url = 'https://instagram.com/bob/posts/1'; $$, $$ SELECT 'instagram'; $$, 'Has Bob Brown youtube post 1');

SELECT results_eq($$ SELECT likes_total from posts_performance where post_id = (SELECT id FROM influencer_posts WHERE url = 'https://instagram.com/alice/posts/1'); $$, $$ SELECT CAST(123 AS NUMERIC); $$, 'Has Alice Anderson instagram post 1 likes');

SELECT results_eq($$ SELECT likes_total from posts_performance where post_id = (SELECT id FROM influencer_posts WHERE url = 'https://instagram.com/alice/posts/2'); $$, $$ SELECT CAST(1230 AS NUMERIC); $$, 'Has Alice Anderson instagram post 2 likes');

SELECT results_eq($$ SELECT likes_total from posts_performance where post_id = (SELECT id FROM influencer_posts WHERE url = 'https://instagram.com/alice/posts/3'); $$, $$ SELECT CAST(0 AS NUMERIC); $$, 'Has Alice Anderson instagram post 3 likes');

SELECT results_eq($$ SELECT likes_total from posts_performance where post_id = (SELECT id FROM influencer_posts WHERE url = 'https://instagram.com/bob/posts/1'); $$, $$ SELECT CAST(12300 AS NUMERIC); $$, 'Has Bob Brown instagram post 1 likes');

SELECT results_eq($$ SELECT likes_total from posts_performance where post_id = (SELECT id FROM influencer_posts WHERE url = 'https://youtube.com/bob/posts/1'); $$, $$ SELECT CAST(12301 AS NUMERIC); $$, 'Has Bob Brown youtube post 1 likes');

SELECT * FROM finish();
ROLLBACK;
