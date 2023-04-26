ALTER TABLE "public"."campaign_notes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."invites" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."logs" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."usages" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaign_notes_deny_all"
ON "public"."campaign_notes"
AS PERMISSIVE
FOR ALL
TO public
USING (false);


CREATE POLICY "invites_deny_all"
ON "public"."invites"
AS PERMISSIVE
FOR ALL
TO public
USING (false);


CREATE POLICY "logs_deny_all"
ON "public"."logs"
AS PERMISSIVE
FOR ALL
TO public
USING (false);


CREATE POLICY "usages_deny_all"
ON "public"."usages"
AS PERMISSIVE
FOR ALL
TO public
USING (false);
