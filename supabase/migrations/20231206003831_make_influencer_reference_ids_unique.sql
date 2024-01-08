CREATE UNIQUE INDEX influencer_social_profiles_reference_id_key ON public.influencer_social_profiles USING btree (reference_id);

ALTER TABLE "public"."influencer_social_profiles" ADD CONSTRAINT "influencer_social_profiles_reference_id_key" UNIQUE USING INDEX "influencer_social_profiles_reference_id_key";
