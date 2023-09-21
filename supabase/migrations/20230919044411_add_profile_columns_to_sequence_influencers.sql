alter table "public"."sequence_influencers" add column "avatar_url" text;

alter table "public"."sequence_influencers" add column "name" text;

alter table "public"."sequence_influencers" add column "platform" text;

alter table "public"."sequence_influencers" add column "social_profile_last_fetched" timestamp with time zone;

alter table "public"."sequence_influencers" add column "url" text;

alter table "public"."sequence_influencers" add column "username" text;

alter table "public"."sequence_influencers" alter column "influencer_social_profile_id" drop not null;


