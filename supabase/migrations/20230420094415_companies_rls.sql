ALTER TABLE "public"."companies" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "companies_delete"
ON "public"."companies"
AS PERMISSIVE
FOR DELETE
TO public
USING (false);


CREATE POLICY "companies_insert"
ON "public"."companies"
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (false);


CREATE POLICY "companies_select"
ON "public"."companies"
AS PERMISSIVE
FOR SELECT
TO public
USING ((is_company_member(id) OR is_relay_employee()));


CREATE POLICY "companies_update"
ON "public"."companies"
AS PERMISSIVE
FOR UPDATE
TO public
USING (false);
