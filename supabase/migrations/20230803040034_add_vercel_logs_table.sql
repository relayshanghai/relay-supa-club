CREATE TABLE "public"."vercel_logs" (
  "id" text NOT NULL,
  "message" text,
  "type" text,
  "source" text,
  "deployment_id" text,
  "timestamp" timestamp without time zone DEFAULT now(),
  "data" jsonb
);


ALTER TABLE "public"."vercel_logs" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX log_drain_pkey ON public.vercel_logs USING btree (id);

ALTER TABLE "public"."vercel_logs" ADD CONSTRAINT "log_drain_pkey" PRIMARY KEY USING INDEX "log_drain_pkey";
