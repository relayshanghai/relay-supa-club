ALTER TABLE "public"."campaigns" ENABLE ROW LEVEL SECURITY;

SET check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_company_member(target_company_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
    BEGIN
    RETURN (SELECT company_id FROM profiles WHERE id = auth.uid()) = target_company_id;
    END;
  $function$;

CREATE POLICY campaigns_all
ON "public"."campaigns"
AS PERMISSIVE
FOR ALL
TO public
USING ((is_company_member(company_id) OR is_relay_employee()));
