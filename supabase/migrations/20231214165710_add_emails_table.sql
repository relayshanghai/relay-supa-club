CREATE TABLE "public"."emails" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "data" jsonb NOT NULL,
  "sender" text NOT NULL,
  "recipients" text NOT NULL,
  "thread_id" text NOT NULL,
  "email_engine_message_id" text NOT NULL,
  "email_engine_id" text NOT NULL,
  "email_engine_account_id" text NOT NULL,
  "deleted_at" timestamp without time zone NULL,
  "created_at" timestamp without time zone DEFAULT now(),
  "updated_at" timestamp without time zone DEFAULT now()
);

ALTER TABLE "public"."emails" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX emails_pkey ON public.emails USING btree (id);

CREATE UNIQUE INDEX emails_email_engine_id_key ON public.emails USING btree (email_engine_id);

ALTER TABLE "public"."emails" ADD CONSTRAINT "emails_pkey" PRIMARY KEY USING INDEX "emails_pkey";

ALTER TABLE "public"."emails" ADD CONSTRAINT "emails_email_engine_id_key" UNIQUE USING INDEX "emails_email_engine_id_key";

ALTER TABLE "public"."emails" ADD CONSTRAINT "emails_thread_id_fkey" FOREIGN KEY (thread_id) REFERENCES threads (thread_id) NOT VALID;

ALTER TABLE "public"."emails" VALIDATE CONSTRAINT "emails_thread_id_fkey";
