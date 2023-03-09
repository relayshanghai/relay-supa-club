-- we'll want to often create a company owner user, a non owner user in the same company, a user in a diffreent company, and a relay employee user. 
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
  -- create a company
  company_name := 'test company';
  company_id := uuid_generate_v4 ();
  INSERT INTO companies (id, NAME)
  VALUES (company_id, company_name);

  -- create a company owner
  company_owner_first_name := 'company owner first_name';
  company_owner_last_name := 'company owner last_name';
  company_owner_email := 'company@owner.email';
  company_owner_id := tests.create_supabase_user (company_owner_email);
    INSERT INTO profiles (id, email, last_name, first_name, user_role, company_id);
  VALUES (company_owner_id, company_owner_email, company_owner_last_name, company_owner_first_name, 'company_owner', company_id);

  -- create a company member
  company_member_first_name := 'company member first_name';
  company_member_last_name := 'company member last_name';
  company_member_email := 'company@member.email';
  company_member_id := tests.create_supabase_user (company_member_email);
    INSERT INTO profiles (id, email, last_name, first_name, user_role, company_id) 
  VALUES (company_member_id, company_member_email, company_member_last_name, company_member_first_name, 'company_member', company_id);

  -- create a second company
  company2_name := 'test company 2';
  company2_id := uuid_generate_v4 ();
  INSERT INTO companies (id, NAME)
  VALUES (company2_id, company2_name);

  -- create a company2 member
  company2_member_first_name := 'company2 member first_name';
  company2_member_last_name := 'company2 member last_name';
  company2_member_email := 'company2@member.email';
  company2_member_id := tests.create_supabase_user (company2_member_email);
    INSERT INTO profiles (id, email, last_name, first_name, user_role, company_id)
  VALUES (company2_member_id, company2_member_email, company2_member_last_name, company2_member_first_name, 'company_member', company2_id);

  -- create a relay company
  relay_company_name := 'relay.club';
  relay_company_id := uuid_generate_v4 ();
  INSERT INTO companies (id, NAME)
  VALUES (relay_company_id, relay_company_name);

  -- create a relay employee
  relay_employee_first_name := 'relay employee first_name';
  relay_employee_last_name := 'relay employee last_name';
  relay_employee_email := 'relay@employee.email';
  relay_employee_id := tests.create_supabase_user (relay_employee_email)
    INSERT INTO profiles (id, email, last_name, first_name, user_role, company_id)
  VALUES (relay_employee_id, relay_employee_email, relay_employee_last_name, relay_employee_first_name, 'relay_employee', relay_company_id);
END;
$$ LANGUAGE plpgsql;