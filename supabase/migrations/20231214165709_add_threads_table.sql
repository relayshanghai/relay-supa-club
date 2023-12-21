CREATE TABLE "public"."threads" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "thread_id" text NOT NULL,
  "sequence_influencer_id" uuid NULL,
  "email_engine_account_id" text NOT NULL,
  "last_reply_id" text NULL,
  "thread_status" text NOT NULL DEFAULT 'unopened'::text,
  "deleted_at" timestamp without time zone NULL,
  "created_at" timestamp without time zone DEFAULT now(),
  "updated_at" timestamp without time zone DEFAULT now()
);

ALTER TABLE "public"."threads" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX threads_pkey ON public.threads USING btree (id);

CREATE UNIQUE INDEX threads_thread_id_key ON public.threads USING btree (thread_id);

ALTER TABLE "public"."threads" ADD CONSTRAINT "threads_pkey" PRIMARY KEY USING INDEX "threads_pkey";

ALTER TABLE "public"."threads" ADD CONSTRAINT "threads_thread_id_key" UNIQUE USING INDEX "threads_thread_id_key";

ALTER TABLE "public"."threads" ADD CONSTRAINT "threads_sequence_influencer_id_fkey" FOREIGN KEY (sequence_influencer_id) REFERENCES sequence_influencers (id) NOT VALID;

ALTER TABLE "public"."threads" VALIDATE CONSTRAINT "threads_sequence_influencer_id_fkey";
