-- only allow company inserts by service key account
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS companies_insert ON companies;

CREATE POLICY companies_insert ON companies FOR INSERT
WITH CHECK (
  false
);
