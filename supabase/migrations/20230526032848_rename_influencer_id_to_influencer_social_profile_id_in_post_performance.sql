ALTER TABLE "public"."posts_performance" DROP CONSTRAINT "posts_performance_influencer_id_fkey";

ALTER TABLE "public"."posts_performance" DROP COLUMN "influencer_id";

ALTER TABLE "public"."posts_performance" ADD COLUMN "influencer_social_profile_id" uuid;

ALTER TABLE "public"."posts_performance" ADD CONSTRAINT "posts_performance_influencer_social_profile_id_fkey" FOREIGN KEY (influencer_social_profile_id) REFERENCES influencer_social_profiles (id) ON DELETE SET NULL NOT VALID;

ALTER TABLE "public"."posts_performance" VALIDATE CONSTRAINT "posts_performance_influencer_social_profile_id_fkey";
