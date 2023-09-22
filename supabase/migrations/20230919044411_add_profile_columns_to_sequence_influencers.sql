ALTER TABLE "public"."sequence_influencers" ADD COLUMN "avatar_url" text;

ALTER TABLE "public"."sequence_influencers" ADD COLUMN "name" text;

ALTER TABLE "public"."sequence_influencers" ADD COLUMN "platform" text;

ALTER TABLE "public"."sequence_influencers" ADD COLUMN "social_profile_last_fetched" timestamp with time zone;

ALTER TABLE "public"."sequence_influencers" ADD COLUMN "url" text;

ALTER TABLE "public"."sequence_influencers" ADD COLUMN "username" text;

ALTER TABLE "public"."sequence_influencers" ALTER COLUMN "influencer_social_profile_id" DROP NOT NULL;
