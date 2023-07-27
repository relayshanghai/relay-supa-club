ALTER TABLE "public"."sequence_influencer" ADD COLUMN "company_id" uuid NOT NULL;

ALTER TABLE "public"."sequence_influencer" ADD COLUMN "sequence_id" uuid NOT NULL;

ALTER TABLE "public"."sequence_influencer" ADD CONSTRAINT "sequence_influencer_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."sequence_influencer" VALIDATE CONSTRAINT "sequence_influencer_company_id_fkey";

ALTER TABLE "public"."sequence_influencer" ADD CONSTRAINT "sequence_influencer_sequence_id_fkey" FOREIGN KEY (sequence_id) REFERENCES sequences (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."sequence_influencer" VALIDATE CONSTRAINT "sequence_influencer_sequence_id_fkey";
