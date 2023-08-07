ALTER TABLE "public"."sequence_email" DROP CONSTRAINT "sequence_email_sequence_influencer_id_fkey";

ALTER TABLE "public"."sequence_email" DROP CONSTRAINT "sequence_email_sequence_step_id_fkey";

ALTER TABLE "public"."sequence_email" DROP CONSTRAINT "sequence_email_pkey";

DROP INDEX IF EXISTS "public"."sequence_email_pkey";

DROP TABLE "public"."sequence_email";

CREATE TABLE "public"."sequence_emails" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "email_send_at" timestamp with time zone,
  "email_message_id" text,
  "email_delivery_status" text,
  "email_tracking_status" text,
  "sequence_influencer_id" uuid NOT NULL,
  "sequence_step_id" uuid NOT NULL,
  "sequence_id" uuid
);


ALTER TABLE "public"."sequence_emails" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX sequence_emails_pkey ON public.sequence_emails USING btree(id);

ALTER TABLE "public"."sequence_emails" ADD CONSTRAINT "sequence_emails_pkey" PRIMARY KEY USING INDEX "sequence_emails_pkey";

ALTER TABLE "public"."sequence_emails" ADD CONSTRAINT "sequence_emails_sequence_id_fkey" FOREIGN KEY (sequence_id) REFERENCES sequences (id) NOT VALID;

ALTER TABLE "public"."sequence_emails" VALIDATE CONSTRAINT "sequence_emails_sequence_id_fkey";

ALTER TABLE "public"."sequence_emails" ADD CONSTRAINT "sequence_emails_sequence_influencer_id_fkey" FOREIGN KEY (sequence_influencer_id) REFERENCES sequence_influencers (id) NOT VALID;

ALTER TABLE "public"."sequence_emails" VALIDATE CONSTRAINT "sequence_emails_sequence_influencer_id_fkey";

ALTER TABLE "public"."sequence_emails" ADD CONSTRAINT "sequence_emails_sequence_step_id_fkey" FOREIGN KEY (sequence_step_id) REFERENCES sequence_steps (id) NOT VALID;

ALTER TABLE "public"."sequence_emails" VALIDATE CONSTRAINT "sequence_emails_sequence_step_id_fkey";
