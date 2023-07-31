ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
-- Allow all selects if user is an activated account
DROP POLICY IF EXISTS influencers_select ON influencers;

CREATE POLICY influencers_select ON influencers FOR SELECT
USING (
  is_activated_account()
);
