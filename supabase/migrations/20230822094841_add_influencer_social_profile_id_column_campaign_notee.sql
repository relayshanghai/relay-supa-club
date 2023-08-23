ALTER TABLE "public"."campaign_notes" ADD COLUMN "influencer_social_profile_id" uuid;

ALTER TABLE "public"."campaign_notes" ALTER COLUMN "campaign_creator_id" DROP NOT NULL;

ALTER TABLE "public"."campaign_notes" ADD CONSTRAINT "campaign_notes_influencer_social_profile_id_fkey" FOREIGN KEY (influencer_social_profile_id) REFERENCES influencer_social_profiles (id) ON DELETE SET NULL NOT VALID;

ALTER TABLE "public"."campaign_notes" VALIDATE CONSTRAINT "campaign_notes_influencer_social_profile_id_fkey";
