ALTER TABLE campaign_creators ENABLE ROW LEVEL SECURITY;

-- Allow all updates to campaign if user belongs to the campaign's company or is a relay employee
DROP POLICY IF EXISTS campaign_creators_all ON campaign_creators;

CREATE POLICY campaign_creators_all ON campaign_creators FOR ALL
USING (
  is_company_member_of_campaign(campaign_id) OR is_relay_employee()
);
