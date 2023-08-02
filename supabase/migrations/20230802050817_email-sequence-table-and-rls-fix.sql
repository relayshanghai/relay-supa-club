CREATE TABLE "public"."sequence_email" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "email_send_at" timestamp with time zone,
  "email_message_id" text,
  "email_delivery_status" text,
  "email_tracking_status" text,
  "sequence_influencer_id" uuid NOT NULL,
  "sequence_step_id" uuid NOT NULL
);


ALTER TABLE "public"."sequence_email" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."sequence_steps" DROP COLUMN "email_delivery_status";

ALTER TABLE "public"."sequence_steps" DROP COLUMN "email_id";

ALTER TABLE "public"."sequence_steps" DROP COLUMN "email_send_at";

ALTER TABLE "public"."sequence_steps" DROP COLUMN "email_tracking_status";

CREATE UNIQUE INDEX sequence_email_pkey ON public.sequence_email USING btree(id);

ALTER TABLE "public"."sequence_email" ADD CONSTRAINT "sequence_email_pkey" PRIMARY KEY USING INDEX "sequence_email_pkey";

ALTER TABLE "public"."sequence_email" ADD CONSTRAINT "sequence_email_sequence_influencer_id_fkey" FOREIGN KEY (sequence_influencer_id) REFERENCES sequence_influencers (id) NOT VALID;

ALTER TABLE "public"."sequence_email" VALIDATE CONSTRAINT "sequence_email_sequence_influencer_id_fkey";

ALTER TABLE "public"."sequence_email" ADD CONSTRAINT "sequence_email_sequence_step_id_fkey" FOREIGN KEY (sequence_step_id) REFERENCES sequence_steps (id) NOT VALID;

ALTER TABLE "public"."sequence_email" VALIDATE CONSTRAINT "sequence_email_sequence_step_id_fkey";

SET check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_activated_account()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
    BEGIN
    RETURN (SELECT subscription_status FROM companies WHERE id = (SELECT company_id FROM profiles WHERE id = auth.uid())) = 'active' OR (SELECT subscription_status FROM companies WHERE id = (SELECT company_id FROM profiles WHERE id = auth.uid())) = 'trial';
    END;
  $function$;
