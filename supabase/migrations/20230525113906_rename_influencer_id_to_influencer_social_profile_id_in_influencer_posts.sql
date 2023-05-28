ALTER TABLE "public"."influencer_posts" DROP CONSTRAINT "influencer_posts_influencer_id_fkey";

ALTER TABLE "public"."influencer_posts" DROP COLUMN "influencer_id";

ALTER TABLE "public"."influencer_posts" ADD COLUMN "influencer_social_profile_id" uuid;

ALTER TABLE "public"."influencer_posts" ADD CONSTRAINT "influencer_posts_influencer_social_profile_id_fkey" FOREIGN KEY (influencer_social_profile_id) REFERENCES influencer_social_profiles (id) ON DELETE SET NULL NOT VALID;

ALTER TABLE "public"."influencer_posts" VALIDATE CONSTRAINT "influencer_posts_influencer_social_profile_id_fkey";
