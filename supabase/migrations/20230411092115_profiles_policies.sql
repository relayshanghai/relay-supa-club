DROP POLICY "Public profiles are viewable by everyone." ON "public"."profiles";

DROP POLICY "Users can insert their own profile." ON "public"."profiles";

DROP POLICY "Users can update own profile." ON "public"."profiles";

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_delete"
ON "public"."profiles"
AS PERMISSIVE
FOR DELETE
TO public
USING (false);


CREATE POLICY "profiles_insert"
ON "public"."profiles"
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (false);


CREATE POLICY "profiles_select"
ON "public"."profiles"
AS PERMISSIVE
FOR SELECT
TO public
USING (((id = auth.uid()) OR is_relay_employee()));


CREATE POLICY "profiles_update"
ON "public"."profiles"
AS PERMISSIVE
FOR UPDATE
TO public
USING (false);
