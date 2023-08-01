ALTER TABLE influencer_social_profiles ENABLE ROW LEVEL SECURITY;
-- Allow all selects if user is an activated account
DROP POLICY IF EXISTS influencer_social_profiles_all ON influencer_social_profiles;

CREATE POLICY influencer_social_profiles_all ON influencer_social_profiles FOR ALL
USING (
  is_activated_account()
);
