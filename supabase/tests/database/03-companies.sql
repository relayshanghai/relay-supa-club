BEGIN;

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS companies_policy_select ON companies;

DROP POLICY IF EXISTS companies_policy_insert ON companies;

DROP POLICY IF EXISTS companies_policy_update ON companies;

DROP POLICY IF EXISTS companies_policy_delete ON companies;

SELECT
  tests.create_test_users ();

-- TODO: move this elsewhere
CREATE
OR REPLACE FUNCTION is_relay_employee () RETURNS BOOLEAN AS $$
DECLARE
  result BOOLEAN DEFAULT FALSE;
BEGIN
  SELECT
    (
      SELECT
        user_role
      FROM
        profiles
      WHERE
        id = auth.uid ()
    ) = 'relay_employee'
  INTO
    result;
  RETURN 
    result;
END;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;

CREATE
OR REPLACE FUNCTION belongs_to_company (company UUID) RETURNS BOOLEAN AS $$
DECLARE
BEGIN
  RETURN 
    (
      SELECT
        company_id
      FROM
        profiles
      WHERE
        id = auth.uid ()
    ) = company;
END;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;

CREATE
OR REPLACE FUNCTION is_company_owner (company UUID) RETURNS BOOLEAN AS $$
--  put profile.user role, and result of belongs_to_company() into variables and print them out
BEGIN
  RETURN 
    (
      SELECT
        user_role
      FROM
        profiles
      WHERE
        id = auth.uid ()
    ) = 'company_owner'
    AND belongs_to_company (company);
END;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;

-- SELECT policy - can only query a company you belong to
CREATE POLICY companies_policy_select ON companies FOR
SELECT
  USING (
    belongs_to_company (id)
    OR is_relay_employee ()
  );

-- INSERT policy - do not allow any inserts (company inserts must be made with the service key client)
CREATE POLICY companies_policy_insert ON companies FOR INSERT
WITH
  CHECK (FALSE);

-- DELETE policy - do not allow any deletes (must be made with service key)
CREATE POLICY companies_policy_delete ON companies FOR DELETE USING (FALSE);

-- UPDATE policy - only company owners and relay employees can update companies
CREATE POLICY companies_policy_update ON companies FOR
UPDATE USING (
  is_company_owner (id)
  OR is_relay_employee ()
);

-- print out users
SELECT
  tests.authenticate_as ('relay-employee');

SELECT
  plan (5);

--  SELECTs
-- 1. Owner can query their own company
SELECT
  tests.authenticate_as ('owner');

SELECT
  IS (
    (
      SELECT
        website
      FROM
        companies
      WHERE
        website = 'company1.com'
    ),
    'company1.com'
  );

-- 2. can't select other company
SELECT
  IS (
    (
      SELECT
        website
      FROM
        companies
      WHERE
        NAME = 'company2.com'
    ),
    NULL
  );

-- 3. relay employee can select any company
SELECT
  tests.authenticate_as ('relay-employee');

SELECT
  IS (
    (
      SELECT
        website
      FROM
        companies
      WHERE
        NAME = 'company1'
    ),
    'company1.com'
  );

-- INSERTs
SELECT
  tests.clear_authentication ();

SELECT
  throws_ok (
    $$ INSERT INTO companies (id, name, website) VALUES ( uuid_generate_v4 (), 'new-company', 'new-company.com'); $$,
    'new row violates row-level security policy for table "companies"'
  );

-- UPDATES 
-- SELECT
--   tests.authenticate_as ('owner');
-- SELECT
--   matches (
--     $$ update companies set website = 'updated by owner' where id = (select id from companies where name = 'company1') returning website $$,
--     'updated by owner',
--     'owner can update their own company'
--   );
-- cannot update other company. Will just return empty
-- SELECT
--   tests.authenticate_as ('owner');
-- SELECT
--   is_empty (
--     $$ update companies set website = 'updated by other' returning website $$,
--     'cannot update other companies'
--   );
SELECT
  *
FROM
  finish ();

SELECT
  truncate_all_tables ('auth');

SELECT
  truncate_all_tables ('public');

ROLLBACK;