ALTER TABLE "public"."influencer_categories" DROP CONSTRAINT "influencer_categories_influencer_fkey";

ALTER TABLE "public"."influencer_posts" DROP CONSTRAINT "influencer_posts_campaign_fkey";

ALTER TABLE "public"."influencer_posts" DROP CONSTRAINT "influencer_posts_influencer_fkey";

ALTER TABLE "public"."influencer_social_profiles" DROP CONSTRAINT "influencer_social_profiles_influencer_fkey";

ALTER TABLE "public"."influencer_categories" ALTER COLUMN "category" SET NOT NULL;

ALTER TABLE "public"."influencer_categories" ALTER COLUMN "influencer_id" SET NOT NULL;

ALTER TABLE "public"."influencer_posts" ALTER COLUMN "campaign_id" SET NOT NULL;

ALTER TABLE "public"."influencer_posts" ALTER COLUMN "influencer_id" SET NOT NULL;

ALTER TABLE "public"."influencer_posts" ALTER COLUMN "is_reusable" SET DEFAULT false;

ALTER TABLE "public"."influencer_posts" ALTER COLUMN "is_reusable" SET NOT NULL;

ALTER TABLE "public"."influencer_posts" ALTER COLUMN "platform" SET NOT NULL;

ALTER TABLE "public"."influencer_posts" ALTER COLUMN "type" SET NOT NULL;

ALTER TABLE "public"."influencer_posts" ALTER COLUMN "url" SET NOT NULL;

ALTER TABLE "public"."influencer_social_profiles" ALTER COLUMN "influencer_id" SET NOT NULL;

ALTER TABLE "public"."influencer_social_profiles" ALTER COLUMN "platform" SET NOT NULL;

ALTER TABLE "public"."influencer_social_profiles" ALTER COLUMN "url" SET NOT NULL;

ALTER TABLE "public"."influencers" ALTER COLUMN "avatar_url" SET NOT NULL;

ALTER TABLE "public"."influencers" ALTER COLUMN "is_recommended" SET DEFAULT false;

ALTER TABLE "public"."influencers" ALTER COLUMN "name" SET NOT NULL;

ALTER TABLE "public"."influencer_categories" ADD CONSTRAINT "influencer_categories_influencer_id_fkey" FOREIGN KEY (influencer_id) REFERENCES influencers (id) NOT VALID;

ALTER TABLE "public"."influencer_categories" VALIDATE CONSTRAINT "influencer_categories_influencer_id_fkey";

ALTER TABLE "public"."influencer_posts" ADD CONSTRAINT "influencer_posts_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES campaigns (id) NOT VALID;

ALTER TABLE "public"."influencer_posts" VALIDATE CONSTRAINT "influencer_posts_campaign_id_fkey";

ALTER TABLE "public"."influencer_posts" ADD CONSTRAINT "influencer_posts_influencer_id_fkey" FOREIGN KEY (influencer_id) REFERENCES influencers (id) NOT VALID;

ALTER TABLE "public"."influencer_posts" VALIDATE CONSTRAINT "influencer_posts_influencer_id_fkey";

ALTER TABLE "public"."influencer_social_profiles" ADD CONSTRAINT "influencer_social_profiles_influencer_id_fkey" FOREIGN KEY (influencer_id) REFERENCES influencers (id) NOT VALID;

ALTER TABLE "public"."influencer_social_profiles" VALIDATE CONSTRAINT "influencer_social_profiles_influencer_id_fkey";
