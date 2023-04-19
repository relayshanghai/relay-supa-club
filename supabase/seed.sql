BEGIN;

-- seed helpers
  CREATE OR REPLACE FUNCTION create_supabase_user(email TEXT, _first_name TEXT, _last_name TEXT)
  RETURNS uuid
  SECURITY DEFINER
  AS $$
    DECLARE
      user_id uuid;
    BEGIN
      user_id := uuid_generate_v4();

      INSERT INTO auth.users (
        "instance_id",
        "id",
        "aud",
        "role",
        "email",
        "encrypted_password",
        "email_confirmed_at",
        "invited_at",
        "confirmation_token",
        "confirmation_sent_at",
        "recovery_token",
        "recovery_sent_at",
        "email_change_token_new",
        "email_change",
        "email_change_sent_at",
        "last_sign_in_at",
        "raw_app_meta_data",
        "raw_user_meta_data",
        "is_super_admin",
        "created_at",
        "updated_at",
        "phone",
        "phone_confirmed_at",
        "phone_change",
        "phone_change_token",
        "phone_change_sent_at",
        "email_change_token_current",
        "email_change_confirm_status",
        "banned_until",
        "reauthentication_token",
        "reauthentication_sent_at",
        "is_sso_user"
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        user_id,
        'authenticated',
        'authenticated',
        email,
        crypt('password123!',
          gen_salt('bf')),
        '2023-02-18 23:31:13.017218+00',
        NULL,
        '',
        '2023-02-18 23:31:12.757017+00',
        '',
        NULL,
        '',
        '',
        NULL,
        '2023-02-18 23:31:13.01781+00',
        '{"provider": "email",
        "providers": ["email"]}',
        json_build_object('test_identifier',
          email,
        'first_name',
        _first_name,
        'last_name',
        _last_name),
        NULL,
        now(),
        now(),
        NULL,
        NULL,
        '',
        '',
        NULL,
        '',
        0,
        NULL,
        '',
        NULL,
        'f'
      );

      RETURN user_id;
    END;
  $$ LANGUAGE plpgsql;

  CREATE OR REPLACE FUNCTION create_profile(company_id UUID, email TEXT, first_name TEXT, last_name TEXT, _role TEXT)
  RETURNS RECORD
  SECURITY DEFINER
  LANGUAGE plpgsql
  AS $$
    DECLARE
      user_id uuid;
      _row RECORD;
    BEGIN
      user_id := create_supabase_user(email, first_name, last_name);

      INSERT INTO profiles
        (id, email, last_name, first_name, user_role, company_id)
      VALUES
        (user_id, email, last_name, first_name, _role, company_id)
      RETURNING * INTO _row;
      RETURN _row;
    END;
  $$;

  CREATE OR REPLACE FUNCTION create_company(company_name TEXT, website TEXT, subscription_status TEXT)
  RETURNS RECORD
  SECURITY DEFINER
  LANGUAGE plpgsql
  AS $$
      DECLARE
        _row RECORD;
      BEGIN
        INSERT INTO companies
          (
            id,
            name,
            website,
            subscription_status,
            cus_id,
            subscription_current_period_end,
            subscription_current_period_start,
            subscription_end_date,
            subscription_start_date,
            profiles_limit,
            searches_limit,
            ai_email_generator_limit
          )
        VALUES
          (
            uuid_generate_v4(),
            company_name,
            website,
            subscription_status,
            'cus_0000000000',
            '2025-01-01 00:00:00.000000+00',
            now(),
            '2025-01-01 00:00:00.000000+00',
            now(),
            '100000000',
            '100000000',
            '100000000'
          )
        RETURNING * INTO _row;
        RETURN _row;
      END;
  $$;

  CREATE OR REPLACE FUNCTION create_campaign(company_id UUID, campaign_name TEXT, campaign_description TEXT, product_name TEXT, tags TEXT[])
  RETURNS RECORD
  SECURITY DEFINER
  LANGUAGE plpgsql
  AS $$
      DECLARE
        _row RECORD;
      BEGIN
        INSERT INTO campaigns
          (
            id,
            created_at,
            company_id,
            name,
            description,
            product_name,
            tag_list,
            target_locations,
            budget_cents,
            budget_currency,
            promo_types,
            status
          )
        VALUES
          (
            uuid_generate_v4(),
            now(),
            company_id,
            campaign_name,
            campaign_description,
            product_name,
            tags,
            ARRAY['United States of America'],
            1000,
            'USD',
            ARRAY['Dedicated Video', 'Integrated Video'],
            'in progress'
          )
        RETURNING * INTO _row;
        RETURN _row;
      END;
  $$;

-- seed data
  DO $$
  DECLARE
    _company_test RECORD;
    _company_relay RECORD;
  BEGIN
    -- Test Company
      _company_test := create_company('Blue Moonlight Stream Enterprises', 'https://blue-moonlight-stream.com', 'trial');

      PERFORM create_profile(_company_test.id, 'william.edward.douglas@blue-moonlight-stream.com', 'William Edward', 'Douglas', 'company_owner');
      PERFORM create_profile(_company_test.id, 'christopher.david.thompson@blue-moonlight-stream.com', 'Christopher David', 'Thompson', 'company_teammate');

      PERFORM create_campaign(
        _company_test.id,
        'Beauty for All Skin Tones',
        'A campaign promoting inclusivity and diversity in the beauty industry. The "Shade Range" makeup line offers a variety of shades for all skin tones, allowing everyone to feel confident and beautiful.',
        'Shade Range Makeup',
        ARRAY['beauty','inclusivity','makeup','diversity','confidence']
      );

    -- Relay Club
      _company_relay := create_company('Relay Club', 'https://relay.club', 'active');

      PERFORM create_campaign(
        _company_relay.id,
        'The Future of Gaming is Here',
        'A campaign promoting the latest and greatest in gaming technology. The "NeonX" gaming console offers high-performance graphics, immersive sound, and a wide range of games to choose from.',
        'NeonX Gaming Console',
        ARRAY['gaming','technology','highperformance','graphics','sound']
      );

      PERFORM create_profile(_company_relay.id, 'jacob@relay.club', 'Jacob', 'Cool', 'relay_employee');
  END;
  $$;

-- cleanup
  DROP FUNCTION IF EXISTS create_company(TEXT, TEXT, TEXT);
  DROP FUNCTION IF EXISTS create_profile(TEXT,TEXT,TEXT,TEXT,UUID);
  DROP FUNCTION IF EXISTS create_supabase_user(TEXT,TEXT,TEXT);
  DROP FUNCTION IF EXISTS create_campaign(UUID,TEXT,TEXT,TEXT,TEXT[]);

COMMIT;
