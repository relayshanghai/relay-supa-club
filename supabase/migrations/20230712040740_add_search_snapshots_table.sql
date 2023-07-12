CREATE TABLE "public"."search_snapshots" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "event_id" uuid,
  "company_id" uuid,
  "profile_id" uuid,
  "snapshot" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now()
);


ALTER TABLE "public"."tracking_events" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX search_snapshots_pkey ON public.search_snapshots USING btree (id);

ALTER TABLE "public"."search_snapshots" ADD CONSTRAINT "search_snapshots_pkey" PRIMARY KEY USING INDEX "search_snapshots_pkey";

ALTER TABLE "public"."search_snapshots" ADD CONSTRAINT "search_snapshots_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE SET NULL NOT VALID;

ALTER TABLE "public"."search_snapshots" VALIDATE CONSTRAINT "search_snapshots_company_id_fkey";

ALTER TABLE "public"."search_snapshots" ADD CONSTRAINT "search_snapshots_event_id_fkey" FOREIGN KEY (event_id) REFERENCES tracking_events (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."search_snapshots" VALIDATE CONSTRAINT "search_snapshots_event_id_fkey";

ALTER TABLE "public"."search_snapshots" ADD CONSTRAINT "search_snapshots_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE SET NULL NOT VALID;

ALTER TABLE "public"."search_snapshots" VALIDATE CONSTRAINT "search_snapshots_profile_id_fkey";
