-- only allow selecting company rows if user is a company member or a relay employee
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS companies_select ON companies;

CREATE POLICY companies_select ON companies FOR SELECT
USING (
  is_company_member(id) OR is_relay_employee()
);
