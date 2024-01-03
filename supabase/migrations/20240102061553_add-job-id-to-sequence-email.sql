ALTER TABLE "public"."sequence_emails" ADD COLUMN "job_id" uuid;

ALTER TABLE "public"."sequence_emails" ADD CONSTRAINT "sequence_emails_job_id_fkey" FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE SET NULL NOT VALID;

ALTER TABLE "public"."sequence_emails" VALIDATE CONSTRAINT "sequence_emails_job_id_fkey";
