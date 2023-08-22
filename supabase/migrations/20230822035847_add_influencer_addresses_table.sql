ALTER TABLE "public"."addresses" ADD COLUMN "influencer_social_profile_id" uuid;

ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_influencer_social_profile_id_fkey" FOREIGN KEY (influencer_social_profile_id) REFERENCES influencer_social_profiles (id) ON DELETE SET NULL NOT VALID;

ALTER TABLE "public"."addresses" VALIDATE CONSTRAINT "addresses_influencer_social_profile_id_fkey";
