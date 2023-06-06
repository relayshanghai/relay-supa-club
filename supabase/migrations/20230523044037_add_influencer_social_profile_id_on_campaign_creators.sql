ALTER TABLE "public"."campaign_creators" ADD COLUMN "influencer_social_profiles_id" uuid;

ALTER TABLE "public"."campaign_creators" ADD CONSTRAINT "campaign_creators_influencer_social_profiles_id_fkey" FOREIGN KEY (influencer_social_profiles_id) REFERENCES influencer_social_profiles (id) ON DELETE SET NULL NOT VALID;

ALTER TABLE "public"."campaign_creators" VALIDATE CONSTRAINT "campaign_creators_influencer_social_profiles_id_fkey";
