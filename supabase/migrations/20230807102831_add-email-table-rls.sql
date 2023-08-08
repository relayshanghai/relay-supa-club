CREATE POLICY "sequence_emails_all"
ON "public"."sequence_emails"
AS PERMISSIVE
FOR ALL
TO public
USING (is_activated_account());
