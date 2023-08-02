CREATE TABLE "public"."report_snapshots" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "event_id" uuid,
  "company_id" uuid,
  "profile_id" uuid,
  "snapshot" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now()
);


CREATE UNIQUE INDEX report_snapshots_pkey ON public.report_snapshots USING btree (id);

ALTER TABLE "public"."report_snapshots" ADD CONSTRAINT "report_snapshots_pkey" PRIMARY KEY USING INDEX "report_snapshots_pkey";

ALTER TABLE "public"."report_snapshots" ADD CONSTRAINT "report_snapshots_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies (id) NOT VALID;

ALTER TABLE "public"."report_snapshots" VALIDATE CONSTRAINT "report_snapshots_company_id_fkey";

ALTER TABLE "public"."report_snapshots" ADD CONSTRAINT "report_snapshots_event_id_fkey" FOREIGN KEY (event_id) REFERENCES tracking_events (id) NOT VALID;

ALTER TABLE "public"."report_snapshots" VALIDATE CONSTRAINT "report_snapshots_event_id_fkey";

ALTER TABLE "public"."report_snapshots" ADD CONSTRAINT "report_snapshots_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles (id) NOT VALID;

ALTER TABLE "public"."report_snapshots" VALIDATE CONSTRAINT "report_snapshots_profile_id_fkey";
