-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
DO $$ BEGIN
 CREATE TYPE "request_status" AS ENUM('ERROR', 'SUCCESS', 'PENDING');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "key_status" AS ENUM('expired', 'invalid', 'valid', 'default');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "key_type" AS ENUM('stream_xchacha20', 'secretstream', 'secretbox', 'kdf', 'generichash', 'shorthash', 'auth', 'hmacsha256', 'hmacsha512', 'aead-det', 'aead-ietf');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "factor_type" AS ENUM('webauthn', 'totp');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "factor_status" AS ENUM('verified', 'unverified');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "aal_level" AS ENUM('aal3', 'aal2', 'aal1');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "code_challenge_method" AS ENUM('plain', 's256');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "campaign_notes" (
	"created_at" timestamp with time zone DEFAULT now(),
	"comment" text,
	"user_id" uuid NOT NULL,
	"campaign_creator_id" uuid,
	"important" boolean DEFAULT false NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"sequence_influencer_id" uuid,
	"influencer_social_profile_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "campaign_creators" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"status" text,
	"campaign_id" uuid,
	"updated_at" timestamp with time zone,
	"relay_creator_id" bigint,
	"creator_model" text,
	"creator_token" text,
	"interested" boolean,
	"email_sent" boolean,
	"publication_date" timestamp with time zone,
	"rate_currency" text DEFAULT 'USD' NOT NULL,
	"payment_details" text,
	"payment_status" text DEFAULT '''unpaid''::text' NOT NULL,
	"address" text,
	"sample_status" text DEFAULT '''unsent''::text' NOT NULL,
	"tracking_details" text,
	"reject_message" text,
	"brief_opened_by_creator" boolean,
	"need_support" boolean,
	"next_step" text,
	"avatar_url" text NOT NULL,
	"username" text,
	"fullname" text,
	"link_url" text,
	"creator_id" text NOT NULL,
	"platform" text DEFAULT '' NOT NULL,
	"added_by_id" uuid NOT NULL,
	"influencer_social_profiles_id" uuid,
	"paid_amount" numeric DEFAULT '0' NOT NULL,
	"payment_currency" text DEFAULT 'USD' NOT NULL,
	"payment_rate" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"name" text NOT NULL,
	"description" text NOT NULL,
	"company_id" uuid NOT NULL,
	"product_link" text,
	"status" text,
	"budget_cents" bigint,
	"budget_currency" text,
	"creator_count" smallint,
	"date_end_creator_outreach" timestamp with time zone,
	"date_start_campaign" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
	"date_end_campaign" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
	"slug" text,
	"product_name" text,
	"requirements" text,
	"tag_list" text[],
	"promo_types" text[],
	"target_locations" text[],
	"media" json[],
	"purge_media" json[],
	"media_path" text[],
	"archived" boolean DEFAULT false,
	"updated_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "companies" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"name" text,
	"website" text,
	"avatar_url" text,
	"updated_at" timestamp with time zone,
	"cus_id" text,
	"searches_limit" text DEFAULT '' NOT NULL,
	"profiles_limit" text DEFAULT '' NOT NULL,
	"subscription_status" text DEFAULT '' NOT NULL,
	"trial_searches_limit" text DEFAULT '' NOT NULL,
	"trial_profiles_limit" text DEFAULT '' NOT NULL,
	"subscription_start_date" timestamp with time zone,
	"subscription_end_date" text,
	"subscription_current_period_end" timestamp with time zone,
	"subscription_current_period_start" timestamp with time zone,
	"ai_email_generator_limit" text DEFAULT 1000 NOT NULL,
	"trial_ai_email_generator_limit" text DEFAULT 10 NOT NULL,
	"size" text,
	"terms_accepted" boolean,
	"subscription_plan" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "influencers" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"name" text NOT NULL,
	"email" text,
	"address" text,
	"avatar_url" text NOT NULL,
	"is_recommended" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"updated_at" timestamp with time zone,
	"avatar_url" text,
	"phone" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"company_id" uuid,
	"last_name" text NOT NULL,
	"first_name" text NOT NULL,
	"email" text,
	"user_role" text,
	"email_engine_account_id" text,
	"sequence_send_email" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invites" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"company_id" uuid NOT NULL,
	"email" text NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"expire_at" timestamp with time zone DEFAULT (now() + '30 days'::interval),
	"updated_at" timestamp with time zone DEFAULT now(),
	"company_owner" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "logs" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"type" text NOT NULL,
	"message" text,
	"data" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"company_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"item_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "influencer_categories" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"category" text NOT NULL,
	"influencer_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "influencer_posts" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp DEFAULT (now() AT TIME ZONE 'utc'::text),
	"url" text NOT NULL,
	"is_reusable" boolean DEFAULT false NOT NULL,
	"publish_date" timestamp DEFAULT (now() AT TIME ZONE 'utc'::text),
	"type" text NOT NULL,
	"campaign_id" uuid,
	"platform" text NOT NULL,
	"updated_at" timestamp DEFAULT (now() AT TIME ZONE 'utc'::text),
	"description" text,
	"preview_url" text,
	"title" text,
	"posted_date" timestamp,
	"influencer_social_profile_id" uuid,
	"deleted_at" timestamp,
	"sequence_id" uuid,
	"sequence_influencer_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "influencer_social_profiles" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"url" text NOT NULL,
	"platform" text NOT NULL,
	"influencer_id" uuid NOT NULL,
	"reference_id" text NOT NULL,
	"username" text NOT NULL,
	"email" text,
	"name" text,
	"avatar_url" text,
	"recent_post_title" text,
	"recent_post_url" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts_performance" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
	"campaign_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"likes_total" numeric,
	"views_total" numeric,
	"comments_total" numeric,
	"orders_total" numeric,
	"sales_total" numeric,
	"sales_revenue" numeric,
	"updated_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
	"influencer_social_profile_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "company_categories" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"category" text NOT NULL,
	"company_id" uuid NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"product_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sales" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"amount" numeric NOT NULL,
	"campaign_id" uuid,
	"company_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "influencer_contacts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"influencer_id" uuid,
	"type" text,
	"value" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"shop_url" text,
	"description" text,
	"price" double precision,
	"price_currency" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sequence_influencers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"added_by" text NOT NULL,
	"email" text,
	"sequence_step" smallint DEFAULT 0 NOT NULL,
	"funnel_status" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"next_step" text,
	"scheduled_post_date" timestamp with time zone,
	"video_details" text,
	"rate_amount" double precision,
	"rate_currency" text,
	"real_full_name" text,
	"company_id" uuid NOT NULL,
	"sequence_id" uuid NOT NULL,
	"address_id" uuid,
	"influencer_social_profile_id" uuid,
	"iqdata_id" text NOT NULL,
	"avatar_url" text,
	"name" text,
	"platform" text,
	"social_profile_last_fetched" timestamp with time zone,
	"url" text,
	"username" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sequence_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text,
	"wait_time_hours" integer DEFAULT 0 NOT NULL,
	"template_id" text NOT NULL,
	"sequence_id" uuid NOT NULL,
	"step_number" smallint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "search_parameters" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"hash" varchar NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "search_parameters_hash_key" UNIQUE("hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sequences" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text NOT NULL,
	"auto_start" boolean DEFAULT false NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manager_first_name" text,
	"manager_id" uuid,
	"deleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "sequences1_id_key" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tracking_events" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"user_id" uuid,
	"profile_id" uuid,
	"company_id" uuid,
	"anonymous_id" varchar,
	"session_id" varchar,
	"journey_id" varchar,
	"journey_type" varchar,
	"event" varchar NOT NULL,
	"data" jsonb,
	"event_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vercel_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"message" text,
	"type" text,
	"source" text,
	"deployment_id" text,
	"timestamp" timestamp DEFAULT now(),
	"data" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "search_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"event_id" uuid,
	"company_id" uuid,
	"profile_id" uuid,
	"parameters_id" uuid,
	"snapshot" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "report_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"event_id" uuid,
	"company_id" uuid,
	"profile_id" uuid,
	"snapshot" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"country" text NOT NULL,
	"state" text NOT NULL,
	"city" text NOT NULL,
	"postal_code" text NOT NULL,
	"address_line_1" text NOT NULL,
	"address_line_2" text,
	"tracking_code" text,
	"phone_number" text,
	"name" text NOT NULL,
	"influencer_social_profile_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"queue" text DEFAULT 'default',
	"run_at" timestamp NOT NULL,
	"payload" json DEFAULT '{}'::json,
	"status" text DEFAULT 'pending',
	"result" json,
	"owner" uuid,
	"retry_count" bigint DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sequence_emails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email_send_at" timestamp with time zone,
	"email_message_id" text,
	"email_delivery_status" text,
	"email_tracking_status" text,
	"sequence_influencer_id" uuid NOT NULL,
	"sequence_step_id" uuid NOT NULL,
	"sequence_id" uuid,
	"email_engine_account_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "template_variables" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"value" text NOT NULL,
	"key" text NOT NULL,
	"sequence_id" uuid NOT NULL,
	"required" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "boostbot_conversations" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"profile_id" uuid NOT NULL,
	"chat_messages" jsonb,
	"search_results" jsonb
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_createdat_runat_status_queue" ON "jobs" ("queue","run_at","status","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_status_queue_owner" ON "jobs" ("queue","status","owner");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "campaign_notes" ADD CONSTRAINT "campaign_notes_campaign_creator_id_fkey" FOREIGN KEY ("campaign_creator_id") REFERENCES "campaign_creators"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "campaign_notes" ADD CONSTRAINT "campaign_notes_influencer_social_profile_id_fkey" FOREIGN KEY ("influencer_social_profile_id") REFERENCES "influencer_social_profiles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "campaign_notes" ADD CONSTRAINT "campaign_notes_sequence_influencer_id_fkey" FOREIGN KEY ("sequence_influencer_id") REFERENCES "sequence_influencers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "campaign_notes" ADD CONSTRAINT "campaign_notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "campaign_creators" ADD CONSTRAINT "campaign_creators_added_by_id_fkey" FOREIGN KEY ("added_by_id") REFERENCES "profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "campaign_creators" ADD CONSTRAINT "campaign_creators_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "campaign_creators" ADD CONSTRAINT "campaign_creators_influencer_social_profiles_id_fkey" FOREIGN KEY ("influencer_social_profiles_id") REFERENCES "influencer_social_profiles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invites" ADD CONSTRAINT "invites_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usages" ADD CONSTRAINT "usages_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "influencer_categories" ADD CONSTRAINT "influencer_categories_influencer_id_fkey" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "influencer_posts" ADD CONSTRAINT "influencer_posts_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "influencer_posts" ADD CONSTRAINT "influencer_posts_influencer_social_profile_id_fkey" FOREIGN KEY ("influencer_social_profile_id") REFERENCES "influencer_social_profiles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "influencer_posts" ADD CONSTRAINT "influencer_posts_sequence_id_fkey" FOREIGN KEY ("sequence_id") REFERENCES "sequences"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "influencer_posts" ADD CONSTRAINT "influencer_posts_sequence_influencer_id_fkey" FOREIGN KEY ("sequence_influencer_id") REFERENCES "sequence_influencers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "influencer_social_profiles" ADD CONSTRAINT "influencer_social_profiles_influencer_id_fkey" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts_performance" ADD CONSTRAINT "posts_performance_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts_performance" ADD CONSTRAINT "posts_performance_influencer_social_profile_id_fkey" FOREIGN KEY ("influencer_social_profile_id") REFERENCES "influencer_social_profiles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts_performance" ADD CONSTRAINT "posts_performance_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "influencer_posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "company_categories" ADD CONSTRAINT "company_categories_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "company_categories" ADD CONSTRAINT "company_categories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales" ADD CONSTRAINT "sales_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales" ADD CONSTRAINT "sales_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "influencer_contacts" ADD CONSTRAINT "influencer_contacts_influencer_id_fkey" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sequence_influencers" ADD CONSTRAINT "sequence_influencers_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sequence_influencers" ADD CONSTRAINT "sequence_influencers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sequence_influencers" ADD CONSTRAINT "sequence_influencers_influencer_social_profile_id_fkey" FOREIGN KEY ("influencer_social_profile_id") REFERENCES "influencer_social_profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sequence_influencers" ADD CONSTRAINT "sequence_influencers_sequence_id_fkey" FOREIGN KEY ("sequence_id") REFERENCES "sequences"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sequence_steps" ADD CONSTRAINT "sequence_steps_sequence_id_fkey" FOREIGN KEY ("sequence_id") REFERENCES "sequences"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sequences" ADD CONSTRAINT "sequences_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sequences" ADD CONSTRAINT "sequences_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "search_snapshots" ADD CONSTRAINT "search_snapshots_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "search_snapshots" ADD CONSTRAINT "search_snapshots_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "tracking_events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "search_snapshots" ADD CONSTRAINT "search_snapshots_parameter_id_fkey" FOREIGN KEY ("parameters_id") REFERENCES "search_parameters"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "search_snapshots" ADD CONSTRAINT "search_snapshots_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "report_snapshots" ADD CONSTRAINT "report_snapshots_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "report_snapshots" ADD CONSTRAINT "report_snapshots_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "tracking_events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "report_snapshots" ADD CONSTRAINT "report_snapshots_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "addresses" ADD CONSTRAINT "addresses_influencer_social_profile_id_fkey" FOREIGN KEY ("influencer_social_profile_id") REFERENCES "influencer_social_profiles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobs" ADD CONSTRAINT "jobs_owner_fkey" FOREIGN KEY ("owner") REFERENCES "profiles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sequence_emails" ADD CONSTRAINT "sequence_emails_sequence_id_fkey" FOREIGN KEY ("sequence_id") REFERENCES "sequences"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sequence_emails" ADD CONSTRAINT "sequence_emails_sequence_influencer_id_fkey" FOREIGN KEY ("sequence_influencer_id") REFERENCES "sequence_influencers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sequence_emails" ADD CONSTRAINT "sequence_emails_sequence_step_id_fkey" FOREIGN KEY ("sequence_step_id") REFERENCES "sequence_steps"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "template_variables" ADD CONSTRAINT "template_variables_sequence_id_fkey" FOREIGN KEY ("sequence_id") REFERENCES "sequences"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "boostbot_conversations" ADD CONSTRAINT "boostbot_conversations_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/