ALTER TABLE "public"."campaign_creators" DROP COLUMN "paid_amount_cents";

ALTER TABLE "public"."campaign_creators" DROP COLUMN "paid_amount_currency";

ALTER TABLE "public"."campaign_creators" DROP COLUMN "rate_cents";

ALTER TABLE "public"."campaign_creators" ADD COLUMN "paid_amount" numeric NOT NULL DEFAULT '0'::numeric;

ALTER TABLE "public"."campaign_creators" ADD COLUMN "payment_currency" text NOT NULL DEFAULT 'USD'::text;

ALTER TABLE "public"."campaign_creators" ADD COLUMN "payment_rate" numeric NOT NULL DEFAULT '0'::numeric;
