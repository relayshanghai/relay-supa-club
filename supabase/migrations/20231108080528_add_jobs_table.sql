CREATE TABLE "public"."jobs" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "queue" text DEFAULT 'default'::text,
  "run_at" timestamp without time zone NOT NULL,
  "payload" json DEFAULT '{}'::json,
  "status" text DEFAULT 'pending'::text,
  "result" json,
  "owner" uuid NOT NULL,
  "retry_count" bigint DEFAULT '0'::bigint,
  "created_at" timestamp with time zone DEFAULT now()
);
CREATE UNIQUE INDEX jobs_pkey ON public.jobs USING btree (id);

ALTER TABLE "public"."jobs" ADD CONSTRAINT "jobs_pkey" PRIMARY KEY USING INDEX "jobs_pkey";

ALTER TABLE "public"."jobs" ADD CONSTRAINT "jobs_owner_fkey" FOREIGN KEY (owner) REFERENCES profiles (id) ON DELETE SET NULL NOT VALID;

ALTER TABLE "public"."jobs" VALIDATE CONSTRAINT "jobs_owner_fkey";
