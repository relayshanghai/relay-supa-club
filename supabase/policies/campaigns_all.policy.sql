-- Allow all/any updates on campaigns table if user belongs to company 
-- or is relay employee
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS campaigns_all ON campaigns;

CREATE POLICY campaigns_all ON campaigns FOR ALL
USING (
  is_company_member(company_id) OR is_relay_employee()
);
