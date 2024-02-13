import {
    pgTable,
    pgEnum,
    uuid,
    timestamp,
    text,
    bigint,
    boolean,
    numeric,
    jsonb,
    smallint,
    doublePrecision,
    integer,
    varchar,
    unique,
    index,
    json,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { FUNNEL_STATUS_VALUES, OUTREACH_STATUSES } from '../src/utils/outreach/constants';
import { CREATOR_PLATFORM_OPTIONS } from '../types';

export const key_status = pgEnum('key_status', ['default', 'valid', 'invalid', 'expired']);
export const key_type = pgEnum('key_type', [
    'aead-ietf',
    'aead-det',
    'hmacsha512',
    'hmacsha256',
    'auth',
    'shorthash',
    'generichash',
    'kdf',
    'secretbox',
    'secretstream',
    'stream_xchacha20',
]);
export const request_status = pgEnum('request_status', ['PENDING', 'SUCCESS', 'ERROR']);
export const factor_type = pgEnum('factor_type', ['totp', 'webauthn']);
export const factor_status = pgEnum('factor_status', ['unverified', 'verified']);
export const aal_level = pgEnum('aal_level', ['aal1', 'aal2', 'aal3']);
export const code_challenge_method = pgEnum('code_challenge_method', ['s256', 'plain']);

export const campaign_creators = pgTable('campaign_creators', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    status: text('status'),
    campaign_id: uuid('campaign_id').references(() => campaigns.id),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    relay_creator_id: bigint('relay_creator_id', { mode: 'number' }),
    creator_model: text('creator_model'),
    creator_token: text('creator_token'),
    interested: boolean('interested'),
    email_sent: boolean('email_sent'),
    publication_date: timestamp('publication_date', { withTimezone: true, mode: 'string' }),
    rate_currency: text('rate_currency').default('USD').notNull(),
    payment_details: text('payment_details'),
    payment_status: text('payment_status')
        .default(sql`'unpaid'::text`)
        .notNull(),
    address: text('address'),
    sample_status: text('sample_status')
        .default(sql`'unsent'::text`)
        .notNull(),
    tracking_details: text('tracking_details'),
    reject_message: text('reject_message'),
    brief_opened_by_creator: boolean('brief_opened_by_creator'),
    need_support: boolean('need_support'),
    next_step: text('next_step'),
    avatar_url: text('avatar_url').notNull(),
    username: text('username'),
    fullname: text('fullname'),
    link_url: text('link_url'),
    creator_id: text('creator_id').notNull(),
    platform: text('platform', { enum: CREATOR_PLATFORM_OPTIONS }).default('youtube').notNull(),
    added_by_id: uuid('added_by_id')
        .notNull()
        .references(() => profiles.id),
    influencer_social_profiles_id: uuid('influencer_social_profiles_id').references(
        () => influencer_social_profiles.id,
        { onDelete: 'set null' },
    ),
    paid_amount: numeric('paid_amount').default('0').notNull(),
    payment_currency: text('payment_currency').default('USD').notNull(),
    payment_rate: numeric('payment_rate').default('0').notNull(),
});

export const campaign_notes = pgTable('campaign_notes', {
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    comment: text('comment'),
    user_id: uuid('user_id')
        .notNull()
        .references(() => profiles.id),
    campaign_creator_id: uuid('campaign_creator_id').references(() => campaign_creators.id, { onDelete: 'cascade' }),
    important: boolean('important').default(false).notNull(),
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    sequence_influencer_id: uuid('sequence_influencer_id').references(() => sequence_influencers.id, {
        onDelete: 'cascade',
    }),
    influencer_social_profile_id: uuid('influencer_social_profile_id').references(() => influencer_social_profiles.id, {
        onDelete: 'set null',
    }),
});

export const influencers = pgTable('influencers', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    name: text('name').notNull(),
    email: text('email'),
    address: text('address'),
    avatar_url: text('avatar_url').notNull(),
    is_recommended: boolean('is_recommended').default(false),
});

export const influencer_categories = pgTable('influencer_categories', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    category: text('category').notNull(),
    influencer_id: uuid('influencer_id')
        .notNull()
        .references(() => influencers.id),
});

export const company_categories = pgTable('company_categories', {
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    category: text('category').notNull(),
    company_id: uuid('company_id')
        .notNull()
        .references(() => companies.id, { onDelete: 'cascade' }),
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    product_id: uuid('product_id').references(() => products.id),
});

export const invites = pgTable('invites', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    company_id: uuid('company_id')
        .notNull()
        .references(() => companies.id),
    email: text('email').notNull(),
    used: boolean('used').default(false).notNull(),
    expire_at: timestamp('expire_at', { withTimezone: true, mode: 'string' }).default(
        sql`(now() + '30 days'::interval)`,
    ),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    company_owner: boolean('company_owner').default(false),
});

export const logs = pgTable('logs', {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    type: text('type').notNull(),
    message: text('message'),
    data: jsonb('data'),
});

export const usages = pgTable('usages', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    company_id: uuid('company_id')
        .notNull()
        .references(() => companies.id),
    user_id: uuid('user_id').notNull(),
    type: text('type').notNull(),
    item_id: text('item_id'),
});

export const posts_performance = pgTable('posts_performance', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).default(
        sql`(now() AT TIME ZONE 'utc'::text)`,
    ),
    campaign_id: uuid('campaign_id')
        .notNull()
        .references(() => campaigns.id),
    post_id: uuid('post_id')
        .notNull()
        .references(() => influencer_posts.id),
    likes_total: numeric('likes_total'),
    views_total: numeric('views_total'),
    comments_total: numeric('comments_total'),
    orders_total: numeric('orders_total'),
    sales_total: numeric('sales_total'),
    sales_revenue: numeric('sales_revenue'),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).default(
        sql`(now() AT TIME ZONE 'utc'::text)`,
    ),
    influencer_social_profile_id: uuid('influencer_social_profile_id').references(() => influencer_social_profiles.id, {
        onDelete: 'set null',
    }),
});

export const campaigns = pgTable('campaigns', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    company_id: uuid('company_id')
        .notNull()
        .references(() => companies.id),
    product_link: text('product_link'),
    status: text('status'),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    budget_cents: bigint('budget_cents', { mode: 'number' }),
    budget_currency: text('budget_currency'),
    creator_count: smallint('creator_count'),
    date_end_creator_outreach: timestamp('date_end_creator_outreach', { withTimezone: true, mode: 'string' }),
    date_start_campaign: timestamp('date_start_campaign', { withTimezone: true, mode: 'string' }).default(
        sql`(now() AT TIME ZONE 'utc'::text)`,
    ),
    date_end_campaign: timestamp('date_end_campaign', { withTimezone: true, mode: 'string' }).default(
        sql`(now() AT TIME ZONE 'utc'::text)`,
    ),
    slug: text('slug'),
    product_name: text('product_name'),
    requirements: text('requirements'),
    tag_list: text('tag_list').array(),
    promo_types: text('promo_types').array(),
    target_locations: text('target_locations').array(),
    // TODO: failed to parse database type 'json[]'
    media: json('media').array(),
    // TODO: failed to parse database type 'json[]'
    purge_media: json('purge_media').array(),
    media_path: text('media_path').array(),
    archived: boolean('archived').default(false),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).default(
        sql`(now() AT TIME ZONE 'utc'::text)`,
    ),
});

export const companies = pgTable('companies', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    name: text('name'),
    website: text('website'),
    avatar_url: text('avatar_url'),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }),
    cus_id: text('cus_id'),
    searches_limit: text('searches_limit').default('').notNull(),
    profiles_limit: text('profiles_limit').default('').notNull(),
    subscription_status: text('subscription_status').default('').notNull(),
    trial_searches_limit: text('trial_searches_limit').default('').notNull(),
    trial_profiles_limit: text('trial_profiles_limit').default('').notNull(),
    subscription_start_date: timestamp('subscription_start_date', { withTimezone: true, mode: 'string' }),
    subscription_end_date: text('subscription_end_date'),
    subscription_current_period_end: timestamp('subscription_current_period_end', {
        withTimezone: true,
        mode: 'string',
    }),
    subscription_current_period_start: timestamp('subscription_current_period_start', {
        withTimezone: true,
        mode: 'string',
    }),
    ai_email_generator_limit: text('ai_email_generator_limit')
        .default(sql`1000::text`)
        .notNull(),
    trial_ai_email_generator_limit: text('trial_ai_email_generator_limit')
        .default(sql`10::text`)
        .notNull(),
    size: text('size'),
    terms_accepted: boolean('terms_accepted'),
    subscription_plan: text('subscription_plan'),
});

export const profiles = pgTable('profiles', {
    id: uuid('id').primaryKey().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }),
    avatar_url: text('avatar_url'),
    phone: text('phone'),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    company_id: uuid('company_id').references(() => companies.id),
    last_name: text('last_name').notNull(),
    first_name: text('first_name').notNull(),
    email: text('email'),
    user_role: text('user_role'),
    email_engine_account_id: text('email_engine_account_id'),
    sequence_send_email: text('sequence_send_email'),
});

export const influencer_posts = pgTable('influencer_posts', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`),
    url: text('url').notNull(),
    is_reusable: boolean('is_reusable').default(false).notNull(),
    publish_date: timestamp('publish_date', { mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`),
    type: text('type').notNull(),
    campaign_id: uuid('campaign_id').references(() => campaigns.id),
    platform: text('platform', { enum: CREATOR_PLATFORM_OPTIONS }).default('youtube').notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`),
    description: text('description'),
    preview_url: text('preview_url'),
    title: text('title'),
    posted_date: timestamp('posted_date', { mode: 'string' }),
    influencer_social_profile_id: uuid('influencer_social_profile_id').references(() => influencer_social_profiles.id, {
        onDelete: 'set null',
    }),
    deleted_at: timestamp('deleted_at', { mode: 'string' }),
    sequence_id: uuid('sequence_id').references(() => sequences.id, { onDelete: 'cascade' }),
    sequence_influencer_id: uuid('sequence_influencer_id').references(() => sequence_influencers.id, {
        onDelete: 'cascade',
    }),
});

export const influencer_social_profiles = pgTable('influencer_social_profiles', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    url: text('url').notNull(),
    platform: text('platform', { enum: CREATOR_PLATFORM_OPTIONS }).default('youtube').notNull(),
    influencer_id: uuid('influencer_id')
        .notNull()
        .references(() => influencers.id),
    reference_id: text('reference_id').notNull(),
    username: text('username').notNull(),
    email: text('email'),
    name: text('name'),
    avatar_url: text('avatar_url'),
    recent_post_title: text('recent_post_title'),
    recent_post_url: text('recent_post_url'),
    data: jsonb('data'),
    topic_tags: jsonb('topic_tags'),
    topics_relevances: jsonb('topics_relevances'),
});

export const sales = pgTable('sales', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    amount: numeric('amount').notNull(),
    campaign_id: uuid('campaign_id').references(() => campaigns.id, { onDelete: 'set null' }),
    company_id: uuid('company_id')
        .notNull()
        .references(() => companies.id, { onDelete: 'cascade' }),
});

export const influencer_contacts = pgTable('influencer_contacts', {
    id: uuid('id').primaryKey().notNull(),
    influencer_id: uuid('influencer_id').references(() => influencers.id),
    type: text('type'),
    value: text('value'),
});

export const sequence_influencers = pgTable('sequence_influencers', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    added_by: text('added_by').notNull(),
    email: text('email'),
    sequence_step: smallint('sequence_step').default(0).notNull(),
    funnel_status: text('funnel_status', {
        enum: FUNNEL_STATUS_VALUES,
    }).notNull(),
    tags: text('tags').default('[]').array().notNull(),
    next_step: text('next_step'),
    scheduled_post_date: timestamp('scheduled_post_date', { withTimezone: true, mode: 'string' }),
    video_details: text('video_details'),
    rate_amount: doublePrecision('rate_amount'),
    rate_currency: text('rate_currency'),
    real_full_name: text('real_full_name'),
    company_id: uuid('company_id')
        .notNull()
        .references(() => companies.id, { onDelete: 'cascade' }),
    sequence_id: uuid('sequence_id')
        .notNull()
        .references(() => sequences.id, { onDelete: 'cascade' }),
    address_id: uuid('address_id').references(() => addresses.id),
    influencer_social_profile_id: uuid('influencer_social_profile_id').references(() => influencer_social_profiles.id),
    iqdata_id: text('iqdata_id').notNull(),
    avatar_url: text('avatar_url'),
    name: text('name'),
    platform: text('platform', { enum: CREATOR_PLATFORM_OPTIONS }).default('youtube').notNull(),
    social_profile_last_fetched: timestamp('social_profile_last_fetched', { withTimezone: true, mode: 'string' }),
    url: text('url'),
    username: text('username'),
    affiliate_link: text('affiliate_link'),
    commission_rate: doublePrecision('commission_rate'),
});

export const products = pgTable('products', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    shop_url: text('shop_url'),
    description: text('description'),
    price: doublePrecision('price'),
    price_currency: text('price_currency'),
});

export const sequence_steps = pgTable('sequence_steps', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    name: text('name'),
    wait_time_hours: integer('wait_time_hours').default(0).notNull(),
    template_id: text('template_id').notNull(),
    sequence_id: uuid('sequence_id')
        .notNull()
        .references(() => sequences.id),
    step_number: smallint('step_number').default(0).notNull(),
});

export const tracking_events = pgTable('tracking_events', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    user_id: uuid('user_id'),
    profile_id: uuid('profile_id').references(() => profiles.id, { onDelete: 'set null' }),
    company_id: uuid('company_id').references(() => companies.id, { onDelete: 'set null' }),
    anonymous_id: varchar('anonymous_id'),
    session_id: varchar('session_id'),
    journey_id: varchar('journey_id'),
    journey_type: varchar('journey_type'),
    event: varchar('event').notNull(),
    data: jsonb('data'),
    event_at: timestamp('event_at', { withTimezone: true, mode: 'string' }),
});

export const vercel_logs = pgTable('vercel_logs', {
    id: text('id').primaryKey().notNull(),
    message: text('message'),
    type: text('type'),
    source: text('source'),
    deployment_id: text('deployment_id'),
    timestamp: timestamp('timestamp', { mode: 'string' }).defaultNow(),
    data: jsonb('data'),
});

export const search_snapshots = pgTable('search_snapshots', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    event_id: uuid('event_id').references(() => tracking_events.id, { onDelete: 'cascade' }),
    company_id: uuid('company_id').references(() => companies.id, { onDelete: 'set null' }),
    profile_id: uuid('profile_id').references(() => profiles.id, { onDelete: 'set null' }),
    parameters_id: uuid('parameters_id').references(() => search_parameters.id, { onDelete: 'set null' }),
    snapshot: jsonb('snapshot').notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const search_parameters = pgTable(
    'search_parameters',
    {
        id: uuid('id')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        hash: varchar('hash').notNull(),
        data: jsonb('data').notNull(),
        created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    },
    (table) => {
        return {
            search_parameters_hash_key: unique('search_parameters_hash_key').on(table.hash),
        };
    },
);

export const report_snapshots = pgTable('report_snapshots', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    event_id: uuid('event_id').references(() => tracking_events.id),
    company_id: uuid('company_id').references(() => companies.id),
    profile_id: uuid('profile_id').references(() => profiles.id),
    snapshot: jsonb('snapshot').notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const addresses = pgTable('addresses', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    country: text('country').notNull(),
    state: text('state').notNull(),
    city: text('city').notNull(),
    postal_code: text('postal_code').notNull(),
    address_line_1: text('address_line_1').notNull(),
    address_line_2: text('address_line_2'),
    tracking_code: text('tracking_code'),
    phone_number: text('phone_number'),
    name: text('name').notNull(),
    influencer_social_profile_id: uuid('influencer_social_profile_id').references(() => influencer_social_profiles.id, {
        onDelete: 'set null',
    }),
});

export const sequences = pgTable(
    'sequences',
    {
        created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
        updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
        company_id: uuid('company_id')
            .notNull()
            .references(() => companies.id, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        auto_start: boolean('auto_start').default(false).notNull(),
        id: uuid('id').defaultRandom().primaryKey().notNull(),
        manager_first_name: text('manager_first_name'),
        manager_id: uuid('manager_id').references(() => profiles.id, { onDelete: 'cascade' }),
        deleted: boolean('deleted').default(false).notNull(),
    },
    (table) => {
        return {
            sequences1_id_key: unique('sequences1_id_key').on(table.id),
        };
    },
);

export const jobs = pgTable(
    'jobs',
    {
        id: uuid('id').defaultRandom().primaryKey().notNull(),
        name: text('name').notNull(),
        queue: text('queue').default('default'),
        run_at: timestamp('run_at', { mode: 'string' }).notNull(),
        payload: json('payload').default({}),
        status: text('status').default('pending'),
        result: json('result'),
        owner: uuid('owner').references(() => profiles.id, { onDelete: 'set null' }),
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        retry_count: bigint('retry_count', { mode: 'number' }).default(0),
        created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    },
    (table) => {
        return {
            idx_createdat_runat_status_queue: index('idx_createdat_runat_status_queue').on(
                table.queue,
                table.run_at,
                table.status,
                table.created_at,
            ),
            idx_status_queue_owner: index('idx_status_queue_owner').on(table.queue, table.status, table.owner),
        };
    },
);

export const sequence_emails = pgTable('sequence_emails', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    email_send_at: timestamp('email_send_at', { withTimezone: true, mode: 'string' }),
    email_message_id: text('email_message_id'),
    email_delivery_status: text('email_delivery_status'),
    email_tracking_status: text('email_tracking_status'),
    sequence_influencer_id: uuid('sequence_influencer_id')
        .notNull()
        .references(() => sequence_influencers.id, { onDelete: 'cascade' }),
    sequence_step_id: uuid('sequence_step_id')
        .notNull()
        .references(() => sequence_steps.id),
    sequence_id: uuid('sequence_id').references(() => sequences.id),
    email_engine_account_id: text('email_engine_account_id'),
    job_id: uuid('job_id').references(() => jobs.id, { onDelete: 'set null' }),
});

export const emails = pgTable(
    'emails',
    {
        id: uuid('id')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        data: jsonb('data').notNull(),
        sender: text('sender').notNull(),
        recipients: text('recipients').notNull(),
        thread_id: text('thread_id')
            .notNull()
            .references(() => threads.thread_id),
        email_engine_message_id: text('email_engine_message_id').notNull(),
        email_engine_id: text('email_engine_id').notNull(),
        email_engine_account_id: text('email_engine_account_id').notNull(),
        deleted_at: timestamp('deleted_at', { mode: 'string' }),
        created_at: timestamp('created_at', { mode: 'string' }).defaultNow(),
        updated_at: timestamp('updated_at', { mode: 'string' }).defaultNow(),
    },
    (table) => {
        return {
            emails_email_engine_id_key: unique('emails_email_engine_id_key').on(table.email_engine_id),
        };
    },
);

export const template_variables = pgTable('template_variables', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    name: text('name').notNull(),
    value: text('value').notNull(),
    key: text('key').notNull(),
    sequence_id: uuid('sequence_id')
        .notNull()
        .references(() => sequences.id, { onDelete: 'cascade' }),
    required: boolean('required').default(true).notNull(),
});

export const boostbot_conversations = pgTable('boostbot_conversations', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    profile_id: uuid('profile_id')
        .notNull()
        .references(() => profiles.id, { onDelete: 'cascade' }),
    chat_messages: jsonb('chat_messages'),
    search_results: jsonb('search_results'),
});

export const threads = pgTable(
    'threads',
    {
        id: uuid('id')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        thread_id: text('thread_id').notNull(),
        sequence_influencer_id: uuid('sequence_influencer_id').references(() => sequence_influencers.id),
        email_engine_account_id: text('email_engine_account_id').notNull(),
        last_reply_id: text('last_reply_id'),
        last_reply_date: timestamp('last_reply_date', { mode: 'string' }),
        thread_status: text('thread_status').default('unopened').notNull(),
        deleted_at: timestamp('deleted_at', { mode: 'string' }),
        created_at: timestamp('created_at', { mode: 'string' }).defaultNow(),
        updated_at: timestamp('updated_at', { mode: 'string' }).defaultNow(),
    },
    (table) => {
        return {
            threads_thread_id_key: unique('threads_thread_id_key').on(table.thread_id),
        };
    },
);

export const thread_contacts = pgTable('thread_contacts', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    thread_id: text('thread_id')
        .notNull()
        .references(() => threads.thread_id),
    email_contact_id: uuid('email_contact_id')
        .notNull()
        .references(() => email_contacts.id),
    type: text('type'),
    created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    deleted_at: timestamp('deleted_at', { mode: 'string' }),
});

export const email_contacts = pgTable(
    'email_contacts',
    {
        id: uuid('id')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        name: varchar('name'),
        address: varchar('address').notNull(),
        created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    },
    (table) => {
        return {
            email_contacts_address_key: unique('email_contacts_address_key').on(table.address),
        };
    },
);

export const outreach_email_templates = pgTable('outreach_email_templates', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    name: text('name').notNull(),
    description: text('description'),
    step: text('step', {
        enum: OUTREACH_STATUSES,
    }).notNull(),
    template: text('template'),
    subject: text('subject'),
    email_engine_template_id: text('email_engine_template_id').notNull(),
    company_id: uuid('company_id')
        .notNull()
        .references(() => companies.id),
});

export const outreach_template_variables = pgTable('myTable', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    name: varchar('name').notNull().unique(),
    category: text('value').notNull(),
    company_id: uuid('company_id')
        .notNull()
        .references(() => companies.id)
        .unique(),
});
