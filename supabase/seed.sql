BEGIN;

-- seed helpers
CREATE
OR REPLACE FUNCTION create_supabase_user(email TEXT, _first_name TEXT, _last_name TEXT) RETURNS UUID SECURITY DEFINER AS $$
  DECLARE
    user_id UUID;
  BEGIN
    user_id := uuid_generate_v4();

    INSERT INTO auth.users (
      "instance_id",
      "id",
      "aud",
      "role",
      "email",
      "encrypted_password",
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

CREATE
OR REPLACE FUNCTION create_profile(
  company_id UUID,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  _role TEXT
) RETURNS RECORD SECURITY DEFINER LANGUAGE plpgsql AS $$
  DECLARE
    user_id UUID;
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

CREATE
OR REPLACE FUNCTION create_company(
  company_name TEXT,
  website TEXT,
  subscription_status TEXT
) RETURNS RECORD SECURITY DEFINER LANGUAGE plpgsql AS $$
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
          'cus_NKXV4aQYAU7GXG',
          '2025-01-01 00:00:00.000000+00',
          now(),
          '2025-01-01 00:00:00.000000+00',
          now(),
          100000000,
          100000000,
          100000000
        )
      RETURNING * INTO _row;
      RETURN _row;
    END;
$$;

CREATE
OR REPLACE FUNCTION create_campaign(
  company_id UUID,
  campaign_name TEXT,
  campaign_description TEXT,
  product_name TEXT,
  tags TEXT[]
) RETURNS RECORD SECURITY DEFINER LANGUAGE plpgsql AS $$
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

CREATE
OR REPLACE FUNCTION create_campaign_creator(
  campaign_id UUID,
  added_by_id UUID,
  avatar_url TEXT,
  creator_id TEXT,
  fullname TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
) RETURNS RECORD SECURITY DEFINER LANGUAGE plpgsql AS $$
    DECLARE
      _row RECORD;
    BEGIN
      INSERT INTO campaign_creators
        (
          id,
          avatar_url,
          creator_id,
          added_by_id,
          payment_rate,
          rate_currency,
          payment_status,
          paid_amount,
          payment_currency,
          sample_status,
          platform,
          status,
          campaign_id,
          next_step,
          fullname,
          updated_at
        )
      VALUES
        (
          uuid_generate_v4(),
          avatar_url,
          creator_id,
          added_by_id,
          0,
          'USD',
          'unpaid',
          0,
          'USD',
          'unsent',
          'youtube',
          'to contact',
          campaign_id,
          'Return email',
          fullname,
          updated_at
        )
      RETURNING * INTO _row;
      RETURN _row;
    END;
$$;

CREATE OR REPLACE FUNCTION create_influencer(
  _name TEXT,
  _email TEXT,
  _address TEXT,
  _avatar_url TEXT,
  _is_recommended BOOLEAN DEFAULT false
) RETURNS RECORD SECURITY DEFINER LANGUAGE plpgsql AS $$
DECLARE
  _row RECORD;
BEGIN
  INSERT INTO influencers (
    id,
    name,
    email,
    address,
    avatar_url,
    is_recommended,
    created_at
  )
  VALUES (
    uuid_generate_v4(),
    _name,
    _email,
    _address,
    _avatar_url,
    _is_recommended,
    now()
  )
  RETURNING * INTO _row;
  RETURN _row;
END;
$$;

CREATE OR REPLACE FUNCTION create_influencer_social_profile(
  _url TEXT,
  _platform TEXT,
  _influencer_id UUID,
  _reference_id TEXT,
  _username TEXT
) RETURNS RECORD SECURITY DEFINER LANGUAGE plpgsql AS $$
DECLARE
  _row RECORD;
BEGIN
  INSERT INTO influencer_social_profiles (
    id,
    url,
    platform,
    influencer_id,
    reference_id,
    username,
    created_at
  )
  VALUES (
    uuid_generate_v4(),
    _url,
    _platform,
    _influencer_id,
    _reference_id,
    _username,
    now()
  )
  RETURNING * INTO _row;
  RETURN _row;
END;
$$;


CREATE OR REPLACE FUNCTION create_influencer_post(
  _url TEXT,
  _campaign_id UUID,
  _influencer_social_profile_id UUID,
  _platform TEXT,
  _type TEXT DEFAULT 'video',
  _is_reusable BOOLEAN DEFAULT false
) RETURNS RECORD SECURITY DEFINER LANGUAGE plpgsql AS $$
DECLARE
  _row RECORD;
BEGIN
  INSERT INTO influencer_posts (
    id,
    url,
    campaign_id,
    influencer_social_profile_id,
    platform,
    type,
    is_reusable,
    created_at,
    updated_at,
    publish_date
  )
  VALUES (
    uuid_generate_v4(),
    _url,
    _campaign_id,
    _influencer_social_profile_id,
    _platform,
    _type,
    _is_reusable,
    now(),
    now(),
    now()
  )
  RETURNING * INTO _row;
  RETURN _row;
END;
$$;


CREATE OR REPLACE FUNCTION create_posts_performance(
  _campaign_id UUID,
  _influencer_social_profile_id UUID,
  _post_id UUID,
  _updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  _likes_total NUMERIC DEFAULT 0,
  _views_total NUMERIC DEFAULT 0,
  _comments_total NUMERIC DEFAULT 0,
  _orders_total NUMERIC DEFAULT 0,
  _sales_total NUMERIC DEFAULT 0,
  _sales_revenue NUMERIC DEFAULT 0
) RETURNS RECORD SECURITY DEFINER LANGUAGE plpgsql AS $$
DECLARE
  _row RECORD;
BEGIN
  INSERT INTO posts_performance (
    id,
    campaign_id,
    influencer_social_profile_id,
    post_id,
    created_at,
    updated_at,
    likes_total,
    views_total,
    comments_total,
    orders_total,
    sales_total,
    sales_revenue
  )
  VALUES (
    uuid_generate_v4(),
    _campaign_id,
    _influencer_social_profile_id,
    _post_id,
    now(),
    _updated_at,
    _likes_total,
    _views_total,
    _comments_total,
    _orders_total,
    _sales_total,
    _sales_revenue
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
  _profile_william RECORD;
  _profile_christopher RECORD;
  _campaign_beauty_for_all RECORD;
  _campaign_gaming RECORD;
  _profile_relay_employee RECORD;
  _influencer_alice RECORD;
  _influencer_bob RECORD;
  _influencer_charlie RECORD;
  _influencer_social_profile_alice_1 RECORD;
  _influencer_social_profile_bob_1 RECORD;
  _influencer_social_profile_bob_2 RECORD;
  _influencer_post_alice_1 RECORD;
  _influencer_post_alice_2 RECORD;
  _influencer_post_alice_3 RECORD;
  _influencer_post_bob_1 RECORD;
  _influencer_post_bob_2 RECORD;
BEGIN
  -- Test Company
  _company_test := create_company('Blue Moonlight Stream Enterprises', 'https://blue-moonlight-stream.com', 'active');

  _profile_william := create_profile(
    _company_test.id,
    'william.edward.douglas@blue-moonlight-stream.com',
    'William Edward',
    'Douglas',
    'company_owner'
  );
  _profile_christopher := create_profile(
    _company_test.id,
    'christopher.david.thompson@blue-moonlight-stream.com',
    'Christopher David',
    'Thompson',
    'company_teammate'
  );

  _campaign_beauty_for_all := create_campaign(
    _company_test.id,
    'Beauty for All Skin Tones',
    'A campaign promoting inclusivity and diversity in the beauty industry. \
    The "Shade Range" makeup line offers a variety of shades for all skin tones, \
    allowing everyone to feel confident and beautiful.',
    'Shade Range Makeup',
    ARRAY['beauty','inclusivity','makeup','diversity','confidence']
  );

  PERFORM create_campaign_creator(
    _campaign_beauty_for_all.id,
    _profile_william.id,
    'https://yt3.googleusercontent.com/SOkJ3PucBImQs1fZSG7O_LSD98FOEzGGKlaaLzt5Hps_REGV8-Ueuh_qjxtWmrRYWskN2URWiQ=s480-c-k-c0x00ffffff-no-rj',
    'UCB_CCSAGP_YCuR36_w2bG1w',
    'Greg Renko'
  );

  _influencer_alice := create_influencer(
    'Alice Anderson',
    'alice.anderson@example.com',
    '123 Apple Street',
    'https://example.com/avatar1',
    false
  );
  _influencer_bob := create_influencer(
    'Bob-Recommended Brown',
    'bob.brown@example.com',
    '456 Bell Street',
    'https://example.com/avatar2'
  );
  _influencer_charlie := create_influencer(
    'Charlie Charles',
    'charlie.charles@example.com',
    '780 Elm Street',
    'https://example.com/avatar3'
  );
  _influencer_social_profile_alice_1 := create_influencer_social_profile(
    'https://instagram.com/alice1',
    'instagram',
    _influencer_alice.id,
    'iqdata_1',
    'alice1'
  );
  _influencer_social_profile_bob_1 := create_influencer_social_profile(
    'https://instagram.com/bob1',
    'instagram',
    _influencer_bob.id,
    'iqdata_2',
    'bob1'
  );
  _influencer_social_profile_bob_2 := create_influencer_social_profile(
    'https://youtube.com/bob2',
    'youtube',
    _influencer_bob.id,
    'iqdata_3',
    'bob2'
  );
  -- Influencer 3 will have no social profiles so we can handle this edge case

  _influencer_post_alice_1 := create_influencer_post(
    'https://instagram.com/alice/posts/1',
    _campaign_beauty_for_all.id,
    _influencer_social_profile_alice_1.id,
    'instagram'
  );
  _influencer_post_alice_2 := create_influencer_post(
    'https://instagram.com/alice/posts/2',
    _campaign_beauty_for_all.id,
    _influencer_social_profile_alice_1.id,
    'instagram'
  );
  _influencer_post_alice_3 := create_influencer_post(
    'https://instagram.com/alice/posts/3',
    _campaign_beauty_for_all.id,
    _influencer_social_profile_alice_1.id,
    'instagram'
  );
  _influencer_post_bob_1 := create_influencer_post(
    'https://instagram.com/bob/posts/1',
    _campaign_beauty_for_all.id,
    _influencer_social_profile_bob_1.id,
    'instagram'
  );
  _influencer_post_bob_2 := create_influencer_post(
    'https://youtube.com/bob/posts/1',
    _campaign_beauty_for_all.id,
    _influencer_social_profile_bob_2.id,
    'youtube'
  );
  PERFORM create_posts_performance(
    _campaign_beauty_for_all.id,
    _influencer_social_profile_alice_1.id,
    _influencer_post_alice_1.id,
    now(),
    123,
    456,
    789,
    3,
    250,
    150
  );
  PERFORM create_posts_performance(
    _campaign_beauty_for_all.id,
    _influencer_social_profile_alice_1.id,
    _influencer_post_alice_2.id,
    '2023-01-01 00:00:00.000000+00',
    1230,
    4560,
    7890,
    30,
    2500,
    1500
  );
  PERFORM create_posts_performance(
    _campaign_beauty_for_all.id,
    _influencer_social_profile_alice_1.id,
    _influencer_post_alice_3.id,
    '2023-01-02 00:00:00.000000+00'
  );
  PERFORM create_posts_performance(
    _campaign_beauty_for_all.id,
    _influencer_social_profile_bob_1.id,
    _influencer_post_bob_1.id,
    '2023-01-03 00:00:00.000000+00',
    12300,
    45600,
    78900,
    300,
    25000,
    15000
  );
  PERFORM create_posts_performance(
    _campaign_beauty_for_all.id,
    _influencer_social_profile_bob_2.id,
    _influencer_post_bob_2.id,
    '2023-01-04 00:00:00.000000+00',
    12301,
    45601,
    78901,
    301,
    25001,
    15001
  );

  -- Relay Club
  _company_relay := create_company('Relay Club', 'https://relay.club', 'active');

  _campaign_gaming := create_campaign(
    _company_relay.id,
    'The Future of Gaming is Here',
    'A campaign promoting the latest and greatest in gaming technology. \
    The "NeonX" gaming console offers high-performance graphics, immersive sound, \
    and a wide range of games to choose from.',
    'NeonX Gaming Console',
    ARRAY['gaming','technology','highperformance','graphics','sound']
  );

  _profile_relay_employee := create_profile(_company_relay.id, 'jacob@relay.club', 'Jacob', 'Cool', 'relay_employee');

  PERFORM create_campaign_creator(
    _campaign_gaming.id,
    _profile_relay_employee.id,
    'https://yt3.googleusercontent.com/S3tNLpc5lGK6i3qKb-3pBxcVTp6Fa0TKpJO8lJW-1fgcksYvZn68S3Ha5ebkIQiNFMeskjTxUBA=s480-c-k-c0x00ffffff-no-rj',
    'UCxo4Q6Wy5Ag4ntlibuyTfIQ',
    'Yousef Gaming'
  );

END;
$$;

-- cleanup
DROP FUNCTION IF EXISTS create_company;
DROP FUNCTION IF EXISTS create_profile;
DROP FUNCTION IF EXISTS create_supabase_user;
DROP FUNCTION IF EXISTS create_campaign;
DROP FUNCTION IF EXISTS create_campaign_creator;
DROP FUNCTION IF EXISTS create_influencer;
DROP FUNCTION IF EXISTS create_influencer_social_profile;
DROP FUNCTION IF EXISTS create_influencer_post;
DROP FUNCTION IF EXISTS create_posts_performance;

COMMIT;
