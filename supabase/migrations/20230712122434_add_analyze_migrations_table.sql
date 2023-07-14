CREATE TABLE "public"."analyze_snapshots" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "event_id" uuid,
  "company_id" uuid,
  "profile_id" uuid,
  "snapshot" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now()
);


CREATE UNIQUE INDEX analyze_snapshots_pkey ON public.analyze_snapshots USING btree (id);

ALTER TABLE "public"."analyze_snapshots" ADD CONSTRAINT "analyze_snapshots_pkey" PRIMARY KEY USING INDEX "analyze_snapshots_pkey";

ALTER TABLE "public"."analyze_snapshots" ADD CONSTRAINT "analyze_snapshots_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies (id) NOT VALID;

ALTER TABLE "public"."analyze_snapshots" VALIDATE CONSTRAINT "analyze_snapshots_company_id_fkey";

ALTER TABLE "public"."analyze_snapshots" ADD CONSTRAINT "analyze_snapshots_event_id_fkey" FOREIGN KEY (event_id) REFERENCES tracking_events (id) NOT VALID;

ALTER TABLE "public"."analyze_snapshots" VALIDATE CONSTRAINT "analyze_snapshots_event_id_fkey";

ALTER TABLE "public"."analyze_snapshots" ADD CONSTRAINT "analyze_snapshots_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles (id) NOT VALID;

ALTER TABLE "public"."analyze_snapshots" VALIDATE CONSTRAINT "analyze_snapshots_profile_id_fkey";
