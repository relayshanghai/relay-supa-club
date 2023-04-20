ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all updates to campaign if user belongs to the company or is relay employee" ON campaigns;

CREATE POLICY "Allow all updates to campaign if user belongs to the campaign's company or is a relay employee" ON campaigns FOR ALL
USING (
  is_company_member(company_id) OR is_relay_employee()
);
