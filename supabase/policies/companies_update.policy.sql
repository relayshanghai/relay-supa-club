-- Do not allow any updates on companies table. 
-- Only the service key account can update companies.
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS companies_update ON companies;

CREATE POLICY companies_update ON companies FOR UPDATE
USING (FALSE);
