ALTER TABLE "public"."influencer_social_profiles" DROP COLUMN "recent_post_title";

ALTER TABLE "public"."influencer_social_profiles" ADD COLUMN "recent_post_title" text;
