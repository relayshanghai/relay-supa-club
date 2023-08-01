ALTER TABLE "public"."sequence_influencers" DROP CONSTRAINT "sequence_influencers_influencer_id_fkey";

ALTER TABLE "public"."influencer_social_profiles" ADD COLUMN "email" text;

ALTER TABLE "public"."influencer_social_profiles" ADD COLUMN "name" text;

ALTER TABLE "public"."sequence_influencers" DROP COLUMN "influencer_id";

ALTER TABLE "public"."sequence_influencers" ADD COLUMN "influencer_social_profile_id" uuid;

ALTER TABLE "public"."sequence_influencers" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."sequence_steps" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."sequences" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."sequence_influencers" ADD CONSTRAINT "sequence_influencers_influencer_social_profile_id_fkey" FOREIGN KEY (influencer_social_profile_id) REFERENCES influencer_social_profiles (id) NOT VALID;

ALTER TABLE "public"."sequence_influencers" VALIDATE CONSTRAINT "sequence_influencers_influencer_social_profile_id_fkey";

SET check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_activated_account()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
    BEGIN
    RETURN (SELECT company_id FROM profiles WHERE id = auth.uid()) = 'active' OR (SELECT company_id FROM profiles WHERE id = auth.uid()) = 'trial';
    END;
  $function$;

CREATE POLICY "addresses_all"
ON "public"."addresses"
AS PERMISSIVE
FOR ALL
TO public
USING (is_activated_account());


CREATE POLICY "influencer_social_profiles_all"
ON "public"."influencer_social_profiles"
AS PERMISSIVE
FOR ALL
TO public
USING (is_activated_account());


CREATE POLICY "influencers_select"
ON "public"."influencers"
AS PERMISSIVE
FOR SELECT
TO public
USING (is_activated_account());


CREATE POLICY "sequence_influencers_all"
ON "public"."sequence_influencers"
AS PERMISSIVE
FOR ALL
TO public
USING (is_activated_account());


CREATE POLICY "sequence_steps_all"
ON "public"."sequence_steps"
AS PERMISSIVE
FOR ALL
TO public
USING (is_activated_account());


CREATE POLICY "sequences_all"
ON "public"."sequences"
AS PERMISSIVE
FOR ALL
TO public
USING (is_activated_account());
