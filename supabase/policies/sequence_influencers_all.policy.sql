ALTER TABLE sequence_influencers ENABLE ROW LEVEL SECURITY;
-- Allow all selects if user is an activated account
DROP POLICY IF EXISTS sequence_influencers_all ON sequence_influencers;

CREATE POLICY sequence_influencers_all ON sequence_influencers FOR ALL
USING (
  is_activated_account()
);
