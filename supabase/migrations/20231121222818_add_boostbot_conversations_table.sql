CREATE TABLE "public"."boostbot_conversations" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "created_at" timestamp with time zone DEFAULT now(),
  "profile_id" uuid NOT NULL,
  "chat_messages" jsonb,
  "search_results" jsonb
);


ALTER TABLE "public"."boostbot_conversations" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX boostbot_conversations_pkey ON public.boostbot_conversations USING btree (id);

ALTER TABLE "public"."boostbot_conversations" ADD CONSTRAINT "boostbot_conversations_pkey" PRIMARY KEY USING INDEX "boostbot_conversations_pkey";

ALTER TABLE "public"."boostbot_conversations" ADD CONSTRAINT "boostbot_conversations_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."boostbot_conversations" VALIDATE CONSTRAINT "boostbot_conversations_profile_id_fkey";

CREATE POLICY "boostbot_conversations_all"
ON "public"."boostbot_conversations"
AS PERMISSIVE
FOR ALL
TO public
USING ((auth.uid() = profile_id))
WITH CHECK ((auth.uid() = profile_id));
