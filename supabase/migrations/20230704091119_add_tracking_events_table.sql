CREATE TABLE "public"."tracking_events" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "created_at" timestamp with time zone DEFAULT now(),
  "user_id" uuid,
  "profile_id" uuid,
  "company_id" uuid,
  "anonymous_id" character varying,
  "session_id" character varying,
  "journey_id" character varying,
  "journey_type" character varying,
  "event" character varying NOT NULL,
  "data" jsonb,
  "event_at" timestamp with time zone
);


ALTER TABLE "public"."tracking_events" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX tracking_events_pkey ON public.tracking_events USING btree (id);

ALTER TABLE "public"."tracking_events" ADD CONSTRAINT "tracking_events_pkey" PRIMARY KEY USING INDEX "tracking_events_pkey";

ALTER TABLE "public"."tracking_events" ADD CONSTRAINT "tracking_events_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE SET NULL NOT VALID;

ALTER TABLE "public"."tracking_events" VALIDATE CONSTRAINT "tracking_events_company_id_fkey";

ALTER TABLE "public"."tracking_events" ADD CONSTRAINT "tracking_events_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE SET NULL NOT VALID;

ALTER TABLE "public"."tracking_events" VALIDATE CONSTRAINT "tracking_events_profile_id_fkey";

ALTER TABLE "public"."tracking_events" ADD CONSTRAINT "tracking_events_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE SET NULL NOT VALID;

ALTER TABLE "public"."tracking_events" VALIDATE CONSTRAINT "tracking_events_user_id_fkey";
