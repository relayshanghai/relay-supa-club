-- only allow company deletes by service key account
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS companies_delete ON companies;

CREATE POLICY companies_delete ON companies FOR DELETE
USING (
  false
);
