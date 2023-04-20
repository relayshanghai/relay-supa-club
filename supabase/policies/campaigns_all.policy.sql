ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
-- Allow all updates to campaign if user belongs to the campaign's company or is a relay employee
DROP POLICY IF EXISTS campaigns_all ON campaigns;

CREATE POLICY campaigns_all ON campaigns FOR ALL
USING (
  is_company_member(company_id) OR is_relay_employee()
);
