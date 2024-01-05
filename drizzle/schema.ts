import {
    pgTable,
    pgEnum,
    timestamp,
    text,
    uuid,
    boolean,
    bigint,
    numeric,
    smallint,
    jsonb,
    doublePrecision,
    integer,
    unique,
    varchar,
    index,
    json,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const requestStatus = pgEnum('request_status', ['ERROR', 'SUCCESS', 'PENDING']);
export const keyStatus = pgEnum('key_status', ['expired', 'invalid', 'valid', 'default']);
export const keyType = pgEnum('key_type', [
    'stream_xchacha20',
    'secretstream',
    'secretbox',
    'kdf',
    'generichash',
    'shorthash',
    'auth',
    'hmacsha256',
    'hmacsha512',
    'aead-det',
    'aead-ietf',
]);
export const factorType = pgEnum('factor_type', ['webauthn', 'totp']);
export const factorStatus = pgEnum('factor_status', ['verified', 'unverified']);
export const aalLevel = pgEnum('aal_level', ['aal3', 'aal2', 'aal1']);
export const codeChallengeMethod = pgEnum('code_challenge_method', ['plain', 's256']);

export const campaignNotes = pgTable('campaign_notes', {
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    comment: text('comment'),
    userId: uuid('user_id')
        .notNull()
        .references(() => profiles.id),
    campaignCreatorId: uuid('campaign_creator_id').references(() => campaignCreators.id, { onDelete: 'cascade' }),
    important: boolean('important').default(false).notNull(),
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    sequenceInfluencerId: uuid('sequence_influencer_id').references(() => sequenceInfluencers.id, {
        onDelete: 'cascade',
    }),
    influencerSocialProfileId: uuid('influencer_social_profile_id').references(() => influencerSocialProfiles.id, {
        onDelete: 'set null',
    }),
});

export const campaignCreators = pgTable('campaign_creators', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    status: text('status'),
    campaignId: uuid('campaign_id').references(() => campaigns.id),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    relayCreatorId: bigint('relay_creator_id', { mode: 'number' }),
    creatorModel: text('creator_model'),
    creatorToken: text('creator_token'),
    interested: boolean('interested'),
    emailSent: boolean('email_sent'),
    publicationDate: timestamp('publication_date', { withTimezone: true, mode: 'string' }),
    rateCurrency: text('rate_currency').default('USD').notNull(),
    paymentDetails: text('payment_details'),
    paymentStatus: text('payment_status')
        .default(sql`'unpaid'::text`)
        .notNull(),
    address: text('address'),
    sampleStatus: text('sample_status')
        .default(sql`'unsent'::text`)
        .notNull(),
    trackingDetails: text('tracking_details'),
    rejectMessage: text('reject_message'),
    briefOpenedByCreator: boolean('brief_opened_by_creator'),
    needSupport: boolean('need_support'),
    nextStep: text('next_step'),
    avatarUrl: text('avatar_url').notNull(),
    username: text('username'),
    fullname: text('fullname'),
    linkUrl: text('link_url'),
    creatorId: text('creator_id').notNull(),
    platform: text('platform').default('').notNull(),
    addedById: uuid('added_by_id')
        .notNull()
        .references(() => profiles.id),
    influencerSocialProfilesId: uuid('influencer_social_profiles_id').references(() => influencerSocialProfiles.id, {
        onDelete: 'set null',
    }),
    paidAmount: numeric('paid_amount').default('0').notNull(),
    paymentCurrency: text('payment_currency').default('USD').notNull(),
    paymentRate: numeric('payment_rate').default('0').notNull(),
});

export const campaigns = pgTable('campaigns', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    companyId: uuid('company_id')
        .notNull()
        .references(() => companies.id),
    productLink: text('product_link'),
    status: text('status'),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    budgetCents: bigint('budget_cents', { mode: 'number' }),
    budgetCurrency: text('budget_currency'),
    creatorCount: smallint('creator_count'),
    dateEndCreatorOutreach: timestamp('date_end_creator_outreach', { withTimezone: true, mode: 'string' }),
    dateStartCampaign: timestamp('date_start_campaign', { withTimezone: true, mode: 'string' }).default(
        sql`(now() AT TIME ZONE 'utc'::text)`,
    ),
    dateEndCampaign: timestamp('date_end_campaign', { withTimezone: true, mode: 'string' }).default(
        sql`(now() AT TIME ZONE 'utc'::text)`,
    ),
    slug: text('slug'),
    productName: text('product_name'),
    requirements: text('requirements'),
    tagList: text('tag_list').array(),
    promoTypes: text('promo_types').array(),
    targetLocations: text('target_locations').array(),
    media: json('media').array(),
    purgeMedia: json('purge_media').array(),
    mediaPath: text('media_path').array(),
    archived: boolean('archived').default(false),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).default(
        sql`(now() AT TIME ZONE 'utc':: text)`,
    ),
});

export const companies = pgTable('companies', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    name: text('name'),
    website: text('website'),
    avatarUrl: text('avatar_url'),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }),
    cusId: text('cus_id'),
    searchesLimit: text('searches_limit').default('').notNull(),
    profilesLimit: text('profiles_limit').default('').notNull(),
    subscriptionStatus: text('subscription_status').default('').notNull(),
    trialSearchesLimit: text('trial_searches_limit').default('').notNull(),
    trialProfilesLimit: text('trial_profiles_limit').default('').notNull(),
    subscriptionStartDate: timestamp('subscription_start_date', { withTimezone: true, mode: 'string' }),
    subscriptionEndDate: text('subscription_end_date'),
    subscriptionCurrentPeriodEnd: timestamp('subscription_current_period_end', { withTimezone: true, mode: 'string' }),
    subscriptionCurrentPeriodStart: timestamp('subscription_current_period_start', {
        withTimezone: true,
        mode: 'string',
    }),
    aiEmailGeneratorLimit: text('ai_email_generator_limit').default('1000').notNull(),
    trialAiEmailGeneratorLimit: text('trial_ai_email_generator_limit').default('10').notNull(),
    size: text('size'),
    termsAccepted: boolean('terms_accepted'),
    subscriptionPlan: text('subscription_plan'),
});

export const influencers = pgTable('influencers', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    name: text('name').notNull(),
    email: text('email'),
    address: text('address'),
    avatarUrl: text('avatar_url').notNull(),
    isRecommended: boolean('is_recommended').default(false),
});

export const profiles = pgTable('profiles', {
    id: uuid('id').primaryKey().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }),
    avatarUrl: text('avatar_url'),
    phone: text('phone'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    companyId: uuid('company_id').references(() => companies.id),
    lastName: text('last_name').notNull(),
    firstName: text('first_name').notNull(),
    email: text('email'),
    userRole: text('user_role'),
    emailEngineAccountId: text('email_engine_account_id'),
    sequenceSendEmail: text('sequence_send_email'),
});

export const invites = pgTable('invites', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    companyId: uuid('company_id')
        .notNull()
        .references(() => companies.id),
    email: text('email').notNull(),
    used: boolean('used').default(false).notNull(),
    expireAt: timestamp('expire_at', { withTimezone: true, mode: 'string' }).default(
        sql`(now() + '30 days'::interval)`,
    ),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    companyOwner: boolean('company_owner').default(false),
});

export const logs = pgTable('logs', {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    type: text('type').notNull(),
    message: text('message'),
    data: jsonb('data'),
});

export const usages = pgTable('usages', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    companyId: uuid('company_id')
        .notNull()
        .references(() => companies.id),
    userId: uuid('user_id').notNull(),
    type: text('type').notNull(),
    itemId: text('item_id'),
});

export const influencerCategories = pgTable('influencer_categories', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    category: text('category').notNull(),
    influencerId: uuid('influencer_id')
        .notNull()
        .references(() => influencers.id),
});

export const influencerPosts = pgTable('influencer_posts', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc':: text)`),
    url: text('url').notNull(),
    isReusable: boolean('is_reusable').default(false).notNull(),
    publishDate: timestamp('publish_date', { mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc':: text)`),
    type: text('type').notNull(),
    campaignId: uuid('campaign_id').references(() => campaigns.id),
    platform: text('platform').notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc':: text)`),
    description: text('description'),
    previewUrl: text('preview_url'),
    title: text('title'),
    postedDate: timestamp('posted_date', { mode: 'string' }),
    influencerSocialProfileId: uuid('influencer_social_profile_id').references(() => influencerSocialProfiles.id, {
        onDelete: 'set null',
    }),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
    sequenceId: uuid('sequence_id').references(() => sequences.id, { onDelete: 'cascade' }),
    sequenceInfluencerId: uuid('sequence_influencer_id').references(() => sequenceInfluencers.id, {
        onDelete: 'cascade',
    }),
});

export const influencerSocialProfiles = pgTable('influencer_social_profiles', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    url: text('url').notNull(),
    platform: text('platform').notNull(),
    influencerId: uuid('influencer_id')
        .notNull()
        .references(() => influencers.id),
    referenceId: text('reference_id').notNull(),
    username: text('username').notNull(),
    email: text('email'),
    name: text('name'),
    avatarUrl: text('avatar_url'),
    recentPostTitle: text('recent_post_title'),
    recentPostUrl: text('recent_post_url'),
});

export const postsPerformance = pgTable('posts_performance', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).default(
        sql`(now() AT TIME ZONE 'utc':: text)`,
    ),
    campaignId: uuid('campaign_id')
        .notNull()
        .references(() => campaigns.id),
    postId: uuid('post_id')
        .notNull()
        .references(() => influencerPosts.id),
    likesTotal: numeric('likes_total'),
    viewsTotal: numeric('views_total'),
    commentsTotal: numeric('comments_total'),
    ordersTotal: numeric('orders_total'),
    salesTotal: numeric('sales_total'),
    salesRevenue: numeric('sales_revenue'),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).default(
        sql`(now() AT TIME ZONE 'utc':: text)`,
    ),
    influencerSocialProfileId: uuid('influencer_social_profile_id').references(() => influencerSocialProfiles.id, {
        onDelete: 'set null',
    }),
});

export const companyCategories = pgTable('company_categories', {
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    category: text('category').notNull(),
    companyId: uuid('company_id')
        .notNull()
        .references(() => companies.id, { onDelete: 'cascade' }),
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    productId: uuid('product_id').references(() => products.id),
});

export const sales = pgTable('sales', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    amount: numeric('amount').notNull(),
    campaignId: uuid('campaign_id').references(() => campaigns.id, { onDelete: 'set null' }),
    companyId: uuid('company_id')
        .notNull()
        .references(() => companies.id, { onDelete: 'cascade' }),
});

export const influencerContacts = pgTable('influencer_contacts', {
    id: uuid('id').primaryKey().notNull(),
    influencerId: uuid('influencer_id').references(() => influencers.id),
    type: text('type'),
    value: text('value'),
});

export const products = pgTable('products', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    shopUrl: text('shop_url'),
    description: text('description'),
    price: doublePrecision('price'),
    priceCurrency: text('price_currency'),
});

export const sequenceInfluencers = pgTable('sequence_influencers', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    addedBy: text('added_by').notNull(),
    email: text('email'),
    sequenceStep: smallint('sequence_step').default(0).notNull(),
    funnelStatus: text('funnel_status').notNull(),
    tags: text('tags').default('{}').array().notNull(),
    nextStep: text('next_step'),
    scheduledPostDate: timestamp('scheduled_post_date', { withTimezone: true, mode: 'string' }),
    videoDetails: text('video_details'),
    rateAmount: doublePrecision('rate_amount'),
    rateCurrency: text('rate_currency'),
    realFullName: text('real_full_name'),
    companyId: uuid('company_id')
        .notNull()
        .references(() => companies.id, { onDelete: 'cascade' }),
    sequenceId: uuid('sequence_id')
        .notNull()
        .references(() => sequences.id, { onDelete: 'cascade' }),
    addressId: uuid('address_id').references(() => addresses.id),
    influencerSocialProfileId: uuid('influencer_social_profile_id').references(() => influencerSocialProfiles.id),
    iqdataId: text('iqdata_id').notNull(),
    avatarUrl: text('avatar_url'),
    name: text('name'),
    platform: text('platform'),
    socialProfileLastFetched: timestamp('social_profile_last_fetched', { withTimezone: true, mode: 'string' }),
    url: text('url'),
    username: text('username'),
});

export const sequenceSteps = pgTable('sequence_steps', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    name: text('name'),
    waitTimeHours: integer('wait_time_hours').default(0).notNull(),
    templateId: text('template_id').notNull(),
    sequenceId: uuid('sequence_id')
        .notNull()
        .references(() => sequences.id),
    stepNumber: smallint('step_number').default(0).notNull(),
});

export const searchParameters = pgTable(
    'search_parameters',
    {
        id: uuid('id')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        hash: varchar('hash').notNull(),
        data: jsonb('data').notNull(),
        createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    },
    (table) => {
        return {
            searchParametersHashKey: unique('search_parameters_hash_key').on(table.hash),
        };
    },
);

export const sequences = pgTable(
    'sequences',
    {
        createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
        companyId: uuid('company_id')
            .notNull()
            .references(() => companies.id, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        autoStart: boolean('auto_start').default(false).notNull(),
        id: uuid('id').defaultRandom().primaryKey().notNull(),
        managerFirstName: text('manager_first_name'),
        managerId: uuid('manager_id').references(() => profiles.id, { onDelete: 'cascade' }),
        deleted: boolean('deleted').default(false).notNull(),
    },
    (table) => {
        return {
            sequences1IdKey: unique('sequences1_id_key').on(table.id),
        };
    },
);

export const trackingEvents = pgTable('tracking_events', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    userId: uuid('user_id'),
    profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'set null' }),
    companyId: uuid('company_id').references(() => companies.id, { onDelete: 'set null' }),
    anonymousId: varchar('anonymous_id'),
    sessionId: varchar('session_id'),
    journeyId: varchar('journey_id'),
    journeyType: varchar('journey_type'),
    event: varchar('event').notNull(),
    data: jsonb('data'),
    eventAt: timestamp('event_at', { withTimezone: true, mode: 'string' }),
});

export const vercelLogs = pgTable('vercel_logs', {
    id: text('id').primaryKey().notNull(),
    message: text('message'),
    type: text('type'),
    source: text('source'),
    deploymentId: text('deployment_id'),
    timestamp: timestamp('timestamp', { mode: 'string' }).defaultNow(),
    data: jsonb('data'),
});

export const searchSnapshots = pgTable('search_snapshots', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    eventId: uuid('event_id').references(() => trackingEvents.id, { onDelete: 'cascade' }),
    companyId: uuid('company_id').references(() => companies.id, { onDelete: 'set null' }),
    profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'set null' }),
    parametersId: uuid('parameters_id').references(() => searchParameters.id, { onDelete: 'set null' }),
    snapshot: jsonb('snapshot').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const reportSnapshots = pgTable('report_snapshots', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    eventId: uuid('event_id').references(() => trackingEvents.id),
    companyId: uuid('company_id').references(() => companies.id),
    profileId: uuid('profile_id').references(() => profiles.id),
    snapshot: jsonb('snapshot').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const addresses = pgTable('addresses', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    country: text('country').notNull(),
    state: text('state').notNull(),
    city: text('city').notNull(),
    postalCode: text('postal_code').notNull(),
    addressLine1: text('address_line_1').notNull(),
    addressLine2: text('address_line_2'),
    trackingCode: text('tracking_code'),
    phoneNumber: text('phone_number'),
    name: text('name').notNull(),
    influencerSocialProfileId: uuid('influencer_social_profile_id').references(() => influencerSocialProfiles.id, {
        onDelete: 'set null',
    }),
});

export const jobs = pgTable(
    'jobs',
    {
        id: uuid('id').defaultRandom().primaryKey().notNull(),
        name: text('name').notNull(),
        queue: text('queue').default('default'),
        runAt: timestamp('run_at', { mode: 'string' }).notNull(),
        payload: json('payload').default({}),
        status: text('status').default('pending'),
        result: json('result'),
        owner: uuid('owner').references(() => profiles.id, { onDelete: 'set null' }),
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        retryCount: bigint('retry_count', { mode: 'number' }).default(0),
        createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    },
    (table) => {
        return {
            idxCreatedatRunatStatusQueue: index('idx_createdat_runat_status_queue').on(
                table.queue,
                table.runAt,
                table.status,
                table.createdAt,
            ),
            idxStatusQueueOwner: index('idx_status_queue_owner').on(table.queue, table.status, table.owner),
        };
    },
);

export const sequenceEmails = pgTable('sequence_emails', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    emailSendAt: timestamp('email_send_at', { withTimezone: true, mode: 'string' }),
    emailMessageId: text('email_message_id'),
    emailDeliveryStatus: text('email_delivery_status'),
    emailTrackingStatus: text('email_tracking_status'),
    sequenceInfluencerId: uuid('sequence_influencer_id')
        .notNull()
        .references(() => sequenceInfluencers.id, { onDelete: 'cascade' }),
    sequenceStepId: uuid('sequence_step_id')
        .notNull()
        .references(() => sequenceSteps.id),
    sequenceId: uuid('sequence_id').references(() => sequences.id),
    emailEngineAccountId: text('email_engine_account_id'),
    jobId: uuid('job_id').references(() => jobs.id, { onDelete: 'set null' }),
});

export const templateVariables = pgTable('template_variables', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    name: text('name').notNull(),
    value: text('value').notNull(),
    key: text('key').notNull(),
    sequenceId: uuid('sequence_id')
        .notNull()
        .references(() => sequences.id, { onDelete: 'cascade' }),
    required: boolean('required').default(true).notNull(),
});

export const boostbotConversations = pgTable('boostbot_conversations', {
    id: uuid('id')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    profileId: uuid('profile_id')
        .notNull()
        .references(() => profiles.id, { onDelete: 'cascade' }),
    chatMessages: jsonb('chat_messages'),
    searchResults: jsonb('search_results'),
});
