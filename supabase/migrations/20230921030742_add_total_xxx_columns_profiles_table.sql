ALTER TABLE "public"."profiles" ADD COLUMN "total_outreach_sent" numeric NOT NULL DEFAULT '0'::numeric;

ALTER TABLE "public"."profiles" ADD COLUMN "total_reports" numeric NOT NULL DEFAULT '0'::numeric;

ALTER TABLE "public"."profiles" ADD COLUMN "total_searches" numeric NOT NULL DEFAULT '0'::numeric;

ALTER TABLE "public"."profiles" ADD COLUMN "total_sequence_influencers" numeric NOT NULL DEFAULT '0'::numeric;

ALTER TABLE "public"."profiles" ADD COLUMN "total_sessions" numeric NOT NULL DEFAULT '0'::numeric;
