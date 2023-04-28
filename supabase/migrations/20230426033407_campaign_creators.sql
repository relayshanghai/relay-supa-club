ALTER TABLE "public"."campaign_creators" ENABLE ROW LEVEL SECURITY;

SET check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_company_member_of_campaign(target_campaign_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
    DECLARE
      target_company_id UUID;
    BEGIN
      SELECT company_id INTO target_company_id FROM campaigns WHERE id = target_campaign_id;
      RETURN (SELECT company_id FROM profiles WHERE id = auth.uid()) = target_company_id;
    END;
  $function$;

CREATE POLICY "campaign_creators_all"
ON "public"."campaign_creators"
AS PERMISSIVE
FOR ALL
TO public
USING ((is_company_member_of_campaign(campaign_id) OR is_relay_employee()));
