ALTER TABLE "public"."campaign_creators" DROP COLUMN "paid_amount_cents";

ALTER TABLE "public"."campaign_creators" DROP COLUMN "paid_amount_currency";

ALTER TABLE "public"."campaign_creators" DROP COLUMN "rate_cents";

ALTER TABLE "public"."campaign_creators" ADD COLUMN "paid_amount" bigint NOT NULL DEFAULT '0'::bigint;

ALTER TABLE "public"."campaign_creators" ADD COLUMN "payment_currency" text NOT NULL DEFAULT 'USD'::text;

ALTER TABLE "public"."campaign_creators" ADD COLUMN "payment_rate" bigint NOT NULL DEFAULT '0'::bigint;
