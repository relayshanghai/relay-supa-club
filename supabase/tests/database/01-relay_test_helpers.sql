CREATE
OR REPLACE FUNCTION tests.create_profile (
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  user_role TEXT,
  company_id UUID
) RETURNS UUID AS $$
DECLARE
  user_id uuid;
BEGIN
  user_id := tests.create_supabase_user (email);
  INSERT INTO profiles (id, email, last_name, first_name, user_role, company_id)
  VALUES (user_id, email, last_name, first_name, user_role, company_id);
  RETURN user_id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION tests.create_company (NAME TEXT) RETURNS UUID AS $$ DECLARE company_id uuid; BEGIN company_id := uuid_generate_v4 (); INSERT INTO companies (id, NAME) VALUES (company_id, name); RETURN company_id; END; $$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION tests.create_test_users () RETURNS void AS $$
DECLARE
  company_id uuid;
  company2_id uuid;
  relay_company_id uuid;
  company_name text;
  company2_name text;
  relay_company_name text;
  company_owner_first_name text;
  company_owner_last_name text;
  company_owner_email text;
  company_owner_id uuid;
  company_member_first_name text;
  company_member_last_name text;
  company_member_email text;
  company_member_id uuid;
  company2_member_first_name text;
  company2_member_last_name text;
  company2_member_email text;
  company2_member_id uuid;
  relay_employee_first_name text;
  relay_employee_last_name text;
  relay_employee_email text;
  relay_employee_id uuid;
BEGIN
  company_owner_email := 'owner';
  company_member_email := 'member';
  company2_member_email := 'company2-member';
  relay_employee_email := 'relay-employee';

  company_name := 'company1';
  company2_name := 'company2';
  relay_company_name := 'relay.club';

  company_owner_first_name := 'owner-first-name';
  company_owner_last_name :=  'owner-last-name';
  company_member_first_name :=  'member-first-name';
  company_member_last_name :=  'member-last-name';
  company2_member_first_name :=  'company2-member-first-name';
  company2_member_last_name :=  'company2-member-last-name';
  relay_employee_first_name :=  'relay-employee-first-name';
  relay_employee_last_name :=  'relay-employee-last-name';

  company_id := tests.create_company (company_name);
  company2_id := tests.create_company (company2_name);
  relay_company_id := tests.create_company (relay_company_name);

  company_owner_id := tests.create_profile (
    company_owner_email,
    company_owner_first_name,
    company_owner_last_name,
    'company_owner',
    company_id
  );
  company_member_id := tests.create_profile (
    company_member_email,
    company_member_first_name,
    company_member_last_name,
    'company_teammate',
    company_id
  );
  company2_member_id := tests.create_profile (
    company2_member_email,
    company2_member_first_name,
    company2_member_last_name,
    'company_teammate',
    company2_id
  );
  relay_employee_id := tests.create_profile (
    relay_employee_email,
    relay_employee_first_name,
    relay_employee_last_name,
    'relay_employee',
    relay_company_id
  );  
END;
$$ LANGUAGE plpgsql;

BEGIN;

SELECT
  tests.create_test_users ();

SELECT
  plan (5);

SELECT
  IS (
    (
      SELECT
        first_name
      FROM
        profiles
      WHERE
        id = tests.get_supabase_uid ('owner')
    ),
    'owner-first-name'
  );

SELECT
  IS (
    (
      SELECT
        last_name
      FROM
        profiles
      WHERE
        id = tests.get_supabase_uid ('owner')
    ),
    'owner-last-name'
  );

SELECT
  IS (
    (
      SELECT
        user_role
      FROM
        profiles
      WHERE
        id = tests.get_supabase_uid ('owner')
    ),
    'company_owner'
  );

SELECT
  IS (
    (
      SELECT
        user_role
      FROM
        profiles
      WHERE
        id = tests.get_supabase_uid ('member')
    ),
    'company_teammate'
  );

SELECT
  IS (
    (
      SELECT
        user_role
      FROM
        profiles
      WHERE
        id = tests.get_supabase_uid ('relay-employee')
    ),
    'relay_employee'
  );

SELECT
  *
FROM
  finish ();

ROLLBACK;