BEGIN;

-- seed helpers
  CREATE OR REPLACE FUNCTION create_supabase_user(identifier text, email text default null, phone text default null)
  RETURNS uuid
  SECURITY DEFINER
  SET search_path = auth, pg_temp
  AS $$
    DECLARE
        user_id uuid;
    BEGIN

        -- create the user
        user_id := extensions.uuid_generate_v4();
        INSERT INTO auth.users (id, email, phone, raw_user_meta_data)
        VALUES (user_id, coalesce(email, concat(user_id, '@test.com')), phone, json_build_object('test_identifier', identifier))
        RETURNING id INTO user_id;

        RETURN user_id;
    END;
  $$ LANGUAGE plpgsql;

  CREATE OR REPLACE FUNCTION create_profile(email TEXT, first_name TEXT, last_name TEXT, user_role TEXT, company_id UUID)
  RETURNS RECORD
  SECURITY DEFINER
  LANGUAGE plpgsql
  AS $$
    DECLARE
      user_id uuid;
      _row RECORD;
    BEGIN
      user_id := create_supabase_user(email, email);

      INSERT INTO profiles
        (id, email, last_name, first_name, user_role, company_id)
      VALUES
        (user_id, email, last_name, first_name, user_role, company_id)
      RETURNING * INTO _row;
      RETURN _row;
    END;
  $$;

  CREATE OR REPLACE FUNCTION create_company(company_name TEXT, website TEXT)
  RETURNS RECORD
  SECURITY DEFINER
  LANGUAGE plpgsql
  AS $$
      DECLARE
        _row RECORD;
      BEGIN
        INSERT INTO companies
          (id, name, website)
        VALUES
          (uuid_generate_v4(), company_name, website)
        RETURNING * INTO _row;
        RETURN _row;
      END;
  $$;

-- seed data
  DO $$
  DECLARE
    _company_foo RECORD;
    _company_relay RECORD;
  BEGIN
    _company_relay := create_company('relay.club', 'http://relay.club');
    _company_foo := create_company('foo.bar', 'http://foo.bar');

   PERFORM create_profile('owner@email.com', 'John', 'Doe', 'company_owner', _company_foo.id);
   PERFORM create_profile('employee@email.com', 'Abraham', 'David', 'company_teammate', _company_foo.id);

   PERFORM create_profile('jacob@relay.club', 'Jacob', 'Cool', 'relay_employee', _company_relay.id);
  END;
  $$;

-- cleanup
  DROP FUNCTION IF EXISTS create_company(TEXT, TEXT);
  DROP FUNCTION IF EXISTS create_profile(TEXT,TEXT,TEXT,TEXT,UUID);
  DROP FUNCTION IF EXISTS create_supabase_user(TEXT,TEXT,TEXT);

COMMIT;
