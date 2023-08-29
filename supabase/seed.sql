BEGIN;

-- seed helpers
CREATE
OR REPLACE FUNCTION create_supabase_user(
  email TEXT, _first_name TEXT, _last_name TEXT
) RETURNS UUID SECURITY DEFINER AS $$
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

CREATE
OR REPLACE FUNCTION create_profile(
  company_id UUID,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  _role TEXT,
  _email_engine_account TEXT DEFAULT null,
  _email_engine_email TEXT DEFAULT null
) RETURNS RECORD SECURITY DEFINER LANGUAGE plpgsql AS $$
  DECLARE
    user_id UUID;
    _row RECORD;
  BEGIN
    user_id := create_supabase_user(email, first_name, last_name);

    INSERT INTO profiles
      (id, email, last_name, first_name, user_role, company_id, email_engine_account_id, sequence_send_email)
    VALUES
      (user_id, email, last_name, first_name, _role, company_id, _email_engine_account, _email_engine_email)
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
OR REPLACE FUNCTION create_company_category(
  company UUID,
  category TEXT
) RETURNS RECORD SECURITY DEFINER LANGUAGE plpgsql AS $$
    DECLARE
      _row RECORD;
    BEGIN
      INSERT INTO company_categories
        (
          category,
          company_id
        )
      VALUES
        (
          category,
          company
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

CREATE
OR REPLACE FUNCTION create_sequence(
  company_id UUID,
  name TEXT,
  manager_first_name TEXT,
  manager_id UUID
) RETURNS RECORD SECURITY DEFINER LANGUAGE plpgsql AS $$
    DECLARE
      _row RECORD;
    BEGIN
      INSERT INTO sequences
        (
          id,
          created_at,
          updated_at,
          company_id,
          name,
          auto_start,
          manager_first_name,
          manager_id
        )
      VALUES
        (
          uuid_generate_v4(),
          now(),
          now(),
          company_id,
          name,
          false,
          manager_first_name,
          manager_id
        )
      RETURNING * INTO _row;
      RETURN _row;
    END;
$$;

CREATE
OR REPLACE FUNCTION create_sequence_steps(
  sequence_id UUID,
  name TEXT,
  template_id TEXT,
  step_number NUMERIC,
  wait_time_hours NUMERIC
) RETURNS RECORD SECURITY DEFINER LANGUAGE plpgsql AS $$
    DECLARE
      _row RECORD;
    BEGIN
      INSERT INTO sequence_steps
        (
          id,
          created_at,
          updated_at,
          sequence_id,
          name,
          template_id,
          step_number,
          wait_time_hours
        )
      VALUES
        (
          uuid_generate_v4(),
          now(),
          now(),
          sequence_id,
          name,
          template_id,
          step_number,
          wait_time_hours
        )
      RETURNING * INTO _row;
      RETURN _row;
    END;
$$;

CREATE
OR REPLACE FUNCTION create_sequence_influencer(
  company_id UUID,
  sequence_id UUID,
  added_by UUID,
  influencer_social_profile_id UUID,
  email TEXT,
  funnel_status TEXT,
  sequence_step NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
) RETURNS RECORD SECURITY DEFINER LANGUAGE plpgsql AS $$
    DECLARE
      _row RECORD;
    BEGIN
      INSERT INTO sequence_influencers
        (
          id,
          created_at,
          updated_at,
          company_id,
          sequence_id,
          added_by,
          email,
          funnel_status,
          influencer_social_profile_id,
          next_step,
          rate_amount,
          rate_currency,
          real_full_name,
          scheduled_post_date,
          sequence_step,
          tags,
          video_details,
          iqdata_id
        )
      VALUES
        (
          uuid_generate_v4(),
          created_at,
          now(),
          company_id,
          sequence_id,
          added_by,
          email,
          funnel_status,
          influencer_social_profile_id,
          'next_step',
          543,
          'USD',
          'real_full_name',
          '2027-01-01 00:00:00.000000+00',
          sequence_step,
          ARRAY['tag1', 'tag2'],
          'video_details',
          'iqdata_id'
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
  _username TEXT,
  _name TEXT,
  _email TEXT,
  _avatar_url TEXT DEFAULT 'https://image-cache.relay.club/?link=https://yt3.googleusercontent.com/ytc/AOPolaSe-ifBRtdfb67uDM8kaHdhdPdQny-MaSRdBfT2NA=s480-c-k-c0x00ffffff-no-rj',
  _recent_post_title TEXT DEFAULT 'Recent Video Title'
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
    created_at,
    name,
    email,
    avatar_url,
    recent_post_title
  )
  VALUES (
    uuid_generate_v4(),
    _url,
    _platform,
    _influencer_id,
    _reference_id,
    _username,
    now(),
    _name,
    _email,
    _avatar_url,
    _recent_post_title
  )
  RETURNING * INTO _row;
  RETURN _row;
END;
$$;

CREATE OR REPLACE FUNCTION create_sequence_email(
  _sequence_id UUID,
  _sequence_influencer_id UUID,
  _sequence_step_id UUID,
  _email_message_id TEXT DEFAULT null,
  _email_delivery_status TEXT DEFAULT null,
  _email_tracking_status TEXT DEFAULT null,
  _email_send_at TIMESTAMP WITH TIME ZONE DEFAULT null,
  _updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
) RETURNS RECORD SECURITY DEFINER LANGUAGE plpgsql AS $$
DECLARE
  _row RECORD;
BEGIN
  INSERT INTO sequence_emails (
    id,
    created_at,
    updated_at,
    sequence_id,
    sequence_influencer_id,
    sequence_step_id,
    email_message_id,
    email_delivery_status,
    email_tracking_status,
    email_send_at
  )
  VALUES (
    uuid_generate_v4(),
    now(),
    _updated_at,
    _sequence_id,
    _sequence_influencer_id,
    _sequence_step_id,
    _email_message_id,
    _email_delivery_status,
    _email_tracking_status,
    _email_send_at

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

CREATE OR REPLACE FUNCTION create_template_variable(
  _sequence_id UUID,
  _key TEXT,
  _name TEXT,
  _value TEXT DEFAULT '',
  _required BOOLEAN DEFAULT true
) RETURNS RECORD SECURITY DEFINER LANGUAGE plpgsql AS $$
DECLARE
  _row RECORD;
BEGIN
  INSERT INTO template_variables (
    id,
    created_at,
    updated_at,
    key,
    name,
    value,
    sequence_id,
    required
  )
  VALUES (
    uuid_generate_v4(),
    now(),
    now(),
    _key,
    _name,
    _value,
    _sequence_id,
    _required
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
  _sequence_general RECORD;
  _campaign_gaming RECORD;
  _profile_relay_employee RECORD;
  _influencer_alice RECORD;
  _influencer_bob RECORD;
  _influencer_charlie RECORD;
  _influencer_daniel RECORD;
  _influencer_felicia RECORD;
  _influencer_georgia RECORD;
  _influencer_pewdiepie RECORD;
  _influencer_mrbeast RECORD;
  _influencer_cocomelon RECORD;
  _influencer_social_profile_alice_1 RECORD;
  _influencer_social_profile_bob_1 RECORD;
  _influencer_social_profile_bob_2 RECORD;
  _influencer_social_profile_charlie_1 RECORD;
  _influencer_social_profile_daniel_1 RECORD;
  _influencer_social_profile_felicia_1 RECORD;
  _influencer_social_profile_georgia_1 RECORD;
  _influencer_social_profile_pewdiepie RECORD;
  _influencer_social_profile_mrbeast RECORD;
  _influencer_social_profile_cocomelon RECORD;
  _influencer_post_alice_1 RECORD;
  _influencer_post_alice_2 RECORD;
  _influencer_post_alice_3 RECORD;
  _influencer_post_bob_1 RECORD;
  _influencer_post_bob_2 RECORD;
  _sequence_step_outreach RECORD;
  _sequence_step_follow_up_1 RECORD;
  _sequence_step_follow_up_2 RECORD;
  _sequence_step_follow_up_3 RECORD;
  _sequence_influencer_daniel RECORD;
  _sequence_influencer_felicia RECORD;
  _sequence_influencer_georgia RECORD;
BEGIN
  -- Test Company
  _company_test := create_company('Blue Moonlight Stream Enterprises', 'https://blue-moonlight-stream.com', 'active');

  PERFORM create_company_category(_company_test.id, 'Video Game Streaming');

  _profile_william := create_profile(
    _company_test.id,
    'william.edward.douglas@blue-moonlight-stream.com',
    'William Edward',
    'Douglas',
    'company_owner',
    'e7ustgsqqvy9al6f',
    'tech.relay.club@gmail.com'
  );
  _profile_christopher := create_profile(
    _company_test.id,
    'christopher.david.thompson@blue-moonlight-stream.com',
    'Christopher David',
    'Thompson',
    'company_teammate',
    null,
    null
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

  _sequence_general := create_sequence(
    _company_test.id,
    'General collaboration',
    _profile_william.first_name,
    _profile_william.id
  );

  _sequence_step_outreach := create_sequence_steps(
    _sequence_general.id,
    'Outreach',
    'AAABiYr-poEAAAAC',
    0,
    0
  );

  _sequence_step_follow_up_1 := create_sequence_steps(
    _sequence_general.id,
    '1st Follow-up',
    'AAABiYsMUIAAAAAD',
    1,
    24
  );
  _sequence_step_follow_up_2 := create_sequence_steps(
    _sequence_general.id,
    '2nd Follow-up',
    'AAABieM0bMMAAAAE',
    2,
    48
  );
  _sequence_step_follow_up_3 := create_sequence_steps(
    _sequence_general.id,
    '3rd Follow-up',
    'AAABieM1AhgAAAAF',
    3,
    72
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
    '',
    false
  );
  _influencer_bob := create_influencer(
    'Bob-Recommended Brown',
    'bob.brown@example.com',
    '456 Bell Street',
    ''
  );
  _influencer_charlie := create_influencer(
    'Charlie Charles',
    'charlie.charles@example.com',
    '780 Elm Street',
    ''
  );
  _influencer_daniel := create_influencer(
    'Daniel Davis',
    'daniel.davis@example.com',
    '480 Elm Street',
    ''
  );
  _influencer_felicia := create_influencer(
    'Felicia Franklin',
    'felicia.franklin@example.com',
    '420 Elm Street',
    ''
  );  
  _influencer_georgia := create_influencer(
    'Georgia Green',
    'georgia.green@example.com',
    '240 Elm Street',
    ''
  );
  _influencer_pewdiepie := create_influencer(
    'PewDiePie',
    'tech+pewdiepie@relay.club',
    null,
    'https://yt3.googleusercontent.com/5oUY3tashyxfqsjO5SGhjT4dus8FkN9CsAHwXWISFrdPYii1FudD4ICtLfuCw6-THJsJbgoY=s480-c-k-c0x00ffffff-no-rj'
  );
  _influencer_mrbeast := create_influencer(
    'MrBeast',
    'tech+mrbeast@relay.club',
    null,
    'https://yt3.googleusercontent.com/ytc/AOPolaSqRAadc5Tv116Y-UfQ--ZLK3bFTep0ZH1_aoLlTA=s480-c-k-c0x00ffffff-no-rj'
  );
  _influencer_cocomelon := create_influencer(
    'Cocomelon - Nursery Rhymes',
    'bounce@gmail.com',
    null,
    'https://yt3.googleusercontent.com/ytc/AOPolaRxd0DEuTsFcyk0wEHdVMk4r7nZhv_7A3AgQ7ndUA=s480-c-k-c0x00ffffff-no-rj'
  );

  _influencer_social_profile_alice_1 := create_influencer_social_profile(
    'https://instagram.com/alice1',
    'instagram',
    _influencer_alice.id,
    'iqdata:1',
    'alice1',
    _influencer_alice.name,
    _influencer_alice.email,
    null
  );
  _influencer_social_profile_bob_1 := create_influencer_social_profile(
    'https://instagram.com/bob1',
    'instagram',
    _influencer_bob.id,
    'iqdata:2',
    'bob1',
    _influencer_bob.name,
    _influencer_bob.email,
    null
  );
  _influencer_social_profile_bob_2 := create_influencer_social_profile(
    'https://youtube.com/bob2',
    'youtube',
    _influencer_bob.id,
    'iqdata:3',
    'bob2',
    _influencer_bob.name,
    _influencer_bob.email,
    null
  );
  _influencer_social_profile_charlie_1 := create_influencer_social_profile(
    'https://instagram.com/charlie1',
    'instagram',
    _influencer_charlie.id,
    'iqdata:4',
    'charlie1',
    _influencer_charlie.name,
    _influencer_charlie.email,
    null
  );
  _influencer_social_profile_daniel_1 := create_influencer_social_profile(
    'https://instagram.com/daniel1',
    'instagram',
    _influencer_daniel.id,
    'iqdata:5',
    'daniel1',
    _influencer_daniel.name,
    _influencer_daniel.email,
    null
  );
  _influencer_social_profile_felicia_1 := create_influencer_social_profile(
    'https://instagram.com/felicia1',
    'instagram',
    _influencer_felicia.id,
    'iqdata:6',
    'felicia1',
    _influencer_felicia.name,
    _influencer_felicia.email,
    null
  );
  _influencer_social_profile_georgia_1 := create_influencer_social_profile(
    'https://instagram.com/georgia1',
    'instagram',
    _influencer_georgia.id,
    'iqdata:7',
    'georgia1',
    _influencer_georgia.name,
    _influencer_georgia.email,
    null
  );
  _influencer_social_profile_pewdiepie := create_influencer_social_profile(
    'https://www.youtube.com/channel/UC-lHJZR3Gqxm24_Vd_AJ5Yw',
    'youtube',
    _influencer_pewdiepie.id,
    'iqdata:UC-lHJZR3Gqxm24_Vd_AJ5Yw',
    'PewDiePie',
    _influencer_pewdiepie.name,
    _influencer_pewdiepie.email,
    _influencer_pewdiepie.avatar_url,
    'Recent Video Title - Pewdiepie'
  );
  _influencer_social_profile_mrbeast := create_influencer_social_profile(
    'https://www.youtube.com/channel/UCX6OQ3DkcsbYNE6H8uQQuVA',
    'youtube',
    _influencer_mrbeast.id,
    'iqdata:UCX6OQ3DkcsbYNE6H8uQQuVA',
    'MrBeast6000',
    _influencer_mrbeast.name,
    _influencer_mrbeast.email,
    _influencer_mrbeast.avatar_url,
    'Recent Video Title - MrBeast'
  );
  _influencer_social_profile_cocomelon := create_influencer_social_profile(
    'https://www.youtube.com/channel/UCbCmjCuTUZos6Inko4u57UQ',
    'youtube',
    _influencer_cocomelon.id,
    'iqdata:UCbCmjCuTUZos6Inko4u57UQ',
    'checkgate',
    _influencer_cocomelon.name,
    _influencer_cocomelon.email,
    _influencer_cocomelon.avatar_url,
    'Recent Video Title - Cocomelon'
  );

  PERFORM create_sequence_influencer(
    _company_test.id,
    _sequence_general.id,
    _profile_william.id,
    _influencer_social_profile_alice_1.id,
    _influencer_social_profile_alice_1.email,
    'To Contact'
  );

  PERFORM create_sequence_influencer(
    _company_test.id,
    _sequence_general.id,
    _profile_william.id,
    _influencer_social_profile_bob_2.id,
    _influencer_social_profile_bob_2.email,
    'To Contact',
    0,
    '2020-01-01 00:00:00.000000+00'
  );

  PERFORM create_sequence_influencer(
    _company_test.id,
    _sequence_general.id,
    _profile_william.id,
    _influencer_social_profile_charlie_1.id,
    _influencer_social_profile_charlie_1.email,
    'To Contact',
    0,
    '2030-01-01 00:00:00.000000+00'
  );

  _sequence_influencer_daniel := create_sequence_influencer(
    _company_test.id,
    _sequence_general.id,
    _profile_william.id,
    _influencer_social_profile_daniel_1.id,
    _influencer_social_profile_daniel_1.email,
    'In Sequence'
  );
  _sequence_influencer_felicia := create_sequence_influencer(
    _company_test.id,
    _sequence_general.id,
    _profile_william.id,
    _influencer_social_profile_felicia_1.id,
    _influencer_social_profile_felicia_1.email,
    'In Sequence',
    1
  );
  _sequence_influencer_georgia := create_sequence_influencer(
    _company_test.id,
    _sequence_general.id,
    _profile_william.id,
    _influencer_social_profile_georgia_1.id,
    _influencer_social_profile_georgia_1.email,
    'Ignored',
    1
  );

  PERFORM create_sequence_email(
    _sequence_general.id,
    _sequence_influencer_daniel.id,
    _sequence_step_outreach.id,
    'Scheduled',
    null,
    '2024-08-01 00:00:00.000000+00',
    null
  );
  PERFORM create_sequence_email(
    _sequence_general.id,
    _sequence_influencer_daniel.id,
    _sequence_step_follow_up_1.id,
    null,
    'Scheduled',
    null,
    '2024-08-02 00:00:00.000000+00'
  );
  PERFORM create_sequence_email(
    _sequence_general.id,
    _sequence_influencer_felicia.id,
    _sequence_step_outreach.id,
    null,
    'Delivered',
    null,
    '2024-08-01 01:00:00.000000+00'
  );
  PERFORM create_sequence_email(
    _sequence_general.id,
    _sequence_influencer_felicia.id,
    _sequence_step_follow_up_1.id,
    '<d7e91ded-7a8e-37e8-6484-837e4e94c3ad@gmail.com>',
    'Delivered',
    'Opened',
    '2024-08-02 01:00:00.000000+00'
  );
  PERFORM create_sequence_email(
    _sequence_general.id,
    _sequence_influencer_georgia.id,
    _sequence_step_outreach.id,
    null,
    'Delivered',
    'Link Clicked',
    '2024-08-01 02:00:00.000000+00'
  );
  PERFORM create_sequence_email(
    _sequence_general.id,
    _sequence_influencer_georgia.id,
    _sequence_step_follow_up_1.id,
    null,
    'Bounced',
    null,
    '2024-08-02 02:00:00.000000+00'
  );

  PERFORM create_template_variable(
    _sequence_general.id,
    'marketingManagerName',
    'Marketing Manager Name',
    'Vivian'
  );
  PERFORM create_template_variable(
    _sequence_general.id,
    'brandName',
    'Brand Name',
    'Blue Moonlight Stream Industries'
  );
  PERFORM create_template_variable(
    _sequence_general.id,
    'productName',
    'Product Name',
    'Widget X'
  );
  PERFORM create_template_variable(
    _sequence_general.id,
    'productDescription',
    'Product Description'
  );
  PERFORM create_template_variable(
    _sequence_general.id,
    'productFeatures',
    'Product Features',
    'Your Product Features'
  );
  PERFORM create_template_variable(
    _sequence_general.id,
    'productLink',
    'Product Link',
    'https://example.com/product'
  );
  PERFORM create_template_variable(
    _sequence_general.id,
    'productPrice',
    'Product Price',
    '450'
  );
  PERFORM create_template_variable(
    _sequence_general.id,
    'influencerNiche',
    'Influencer Niche',
    'Consumer Electronics'
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

  PERFORM create_company_category(_company_test.id, 'Influencer Marketing');

  _campaign_gaming := create_campaign(
    _company_relay.id,
    'The Future of Gaming is Here',
    'A campaign promoting the latest and greatest in gaming technology. \
    The "NeonX" gaming console offers high-performance graphics, immersive sound, \
    and a wide range of games to choose from.',
    'NeonX Gaming Console',
    ARRAY['gaming','technology','highperformance','graphics','sound']
  );

  _profile_relay_employee := create_profile(_company_relay.id, 'jacob@relay.club', 'Jacob', 'Cool', 'relay_employee', null, null);

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
DROP FUNCTION IF EXISTS create_company_category;
DROP FUNCTION IF EXISTS create_profile;
DROP FUNCTION IF EXISTS create_supabase_user;
DROP FUNCTION IF EXISTS create_campaign;
DROP FUNCTION IF EXISTS create_campaign_creator;
DROP FUNCTION IF EXISTS create_influencer;
DROP FUNCTION IF EXISTS create_influencer_social_profile;
DROP FUNCTION IF EXISTS create_influencer_post;
DROP FUNCTION IF EXISTS create_posts_performance;
DROP FUNCTION IF EXISTS create_sequence;
DROP FUNCTION IF EXISTS create_sequence_influencer;
DROP FUNCTION IF EXISTS create_sequence_steps;
DROP FUNCTION IF EXISTS create_sequence_email;
DROP FUNCTION IF EXISTS create_template_variable;
COMMIT;
