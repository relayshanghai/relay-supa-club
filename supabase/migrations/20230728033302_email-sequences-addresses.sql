CREATE TABLE "public"."addresses" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "country" text NOT NULL,
  "state" text NOT NULL,
  "city" text NOT NULL,
  "postal_code" text NOT NULL,
  "address_line_1" text NOT NULL,
  "address_line_2" text,
  "tracking_code" text,
  "phone_number" text,
  "name" text NOT NULL
);


ALTER TABLE "public"."addresses" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."products" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "shop_url" text,
  "description" text,
  "price" double precision,
  "price_currency" text
);


CREATE TABLE "public"."sequence_influencers" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "added_by" text NOT NULL,
  "influencer_id" uuid NOT NULL,
  "email" text,
  "sequence_step" smallint NOT NULL DEFAULT '0'::smallint,
  "funnel_status" text NOT NULL,
  "tags" text[] NOT NULL DEFAULT '{}'::text[],
  "next_step" text,
  "scheduled_post_date" timestamp with time zone,
  "video_details" text,
  "rate_amount" double precision,
  "rate_currency" text,
  "real_full_name" text,
  "company_id" uuid NOT NULL,
  "sequence_id" uuid NOT NULL,
  "address_id" uuid
);


CREATE TABLE "public"."sequence_steps" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "name" text,
  "wait_time_hours" integer NOT NULL DEFAULT 0,
  "template_id" text NOT NULL,
  "params" text[] NOT NULL DEFAULT '{}'::text[],
  "sequence_id" uuid NOT NULL,
  "step_number" smallint NOT NULL DEFAULT '0'::smallint,
  "email_send_at" timestamp with time zone,
  "email_id" text,
  "email_delivery_status" text,
  "email_tracking_status" text
);


CREATE TABLE "public"."sequences" (
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "company_id" uuid NOT NULL,
  "name" text NOT NULL,
  "auto_start" boolean NOT NULL DEFAULT false,
  "id" uuid NOT NULL DEFAULT gen_random_uuid()
);


ALTER TABLE "public"."campaign_notes" ADD COLUMN "sequence_influencer_id" uuid;

ALTER TABLE "public"."company_categories" ADD COLUMN "product_id" uuid;

ALTER TABLE "public"."influencer_posts" ADD COLUMN "sequence_id" uuid;

ALTER TABLE "public"."influencer_posts" ADD COLUMN "sequence_influencer_id" uuid;

ALTER TABLE "public"."usages" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX addresses_pkey ON public.addresses USING btree(id);

CREATE UNIQUE INDEX product_pkey ON public.products USING btree(id);

CREATE UNIQUE INDEX sequence_influencer_pkey ON public.sequence_influencers USING btree(id);

CREATE UNIQUE INDEX sequence_steps_pkey ON public.sequence_steps USING btree(id);

CREATE UNIQUE INDEX sequences1_id_key ON public.sequences USING btree(id);

CREATE UNIQUE INDEX sequences1_pkey ON public.sequences USING btree(id);

ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_pkey" PRIMARY KEY USING INDEX "addresses_pkey";

ALTER TABLE "public"."products" ADD CONSTRAINT "product_pkey" PRIMARY KEY USING INDEX "product_pkey";

ALTER TABLE "public"."sequence_influencers" ADD CONSTRAINT "sequence_influencer_pkey" PRIMARY KEY USING INDEX "sequence_influencer_pkey";

ALTER TABLE "public"."sequence_steps" ADD CONSTRAINT "sequence_steps_pkey" PRIMARY KEY USING INDEX "sequence_steps_pkey";

ALTER TABLE "public"."sequences" ADD CONSTRAINT "sequences1_pkey" PRIMARY KEY USING INDEX "sequences1_pkey";

ALTER TABLE "public"."campaign_notes" ADD CONSTRAINT "campaign_notes_sequence_influencer_id_fkey" FOREIGN KEY (sequence_influencer_id) REFERENCES sequence_influencers (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."campaign_notes" VALIDATE CONSTRAINT "campaign_notes_sequence_influencer_id_fkey";

ALTER TABLE "public"."company_categories" ADD CONSTRAINT "company_categories_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products (id) NOT VALID;

ALTER TABLE "public"."company_categories" VALIDATE CONSTRAINT "company_categories_product_id_fkey";

ALTER TABLE "public"."influencer_posts" ADD CONSTRAINT "influencer_posts_sequence_id_fkey" FOREIGN KEY (sequence_id) REFERENCES sequences (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."influencer_posts" VALIDATE CONSTRAINT "influencer_posts_sequence_id_fkey";

ALTER TABLE "public"."influencer_posts" ADD CONSTRAINT "influencer_posts_sequence_influencer_id_fkey" FOREIGN KEY (sequence_influencer_id) REFERENCES sequence_influencers (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."influencer_posts" VALIDATE CONSTRAINT "influencer_posts_sequence_influencer_id_fkey";

ALTER TABLE "public"."sequence_influencers" ADD CONSTRAINT "sequence_influencers_address_id_fkey" FOREIGN KEY (address_id) REFERENCES addresses (id) NOT VALID;

ALTER TABLE "public"."sequence_influencers" VALIDATE CONSTRAINT "sequence_influencers_address_id_fkey";

ALTER TABLE "public"."sequence_influencers" ADD CONSTRAINT "sequence_influencers_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."sequence_influencers" VALIDATE CONSTRAINT "sequence_influencers_company_id_fkey";

ALTER TABLE "public"."sequence_influencers" ADD CONSTRAINT "sequence_influencers_influencer_id_fkey" FOREIGN KEY (influencer_id) REFERENCES influencers (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."sequence_influencers" VALIDATE CONSTRAINT "sequence_influencers_influencer_id_fkey";

ALTER TABLE "public"."sequence_influencers" ADD CONSTRAINT "sequence_influencers_sequence_id_fkey" FOREIGN KEY (sequence_id) REFERENCES sequences (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."sequence_influencers" VALIDATE CONSTRAINT "sequence_influencers_sequence_id_fkey";

ALTER TABLE "public"."sequence_steps" ADD CONSTRAINT "sequence_steps_sequence_id_fkey" FOREIGN KEY (sequence_id) REFERENCES sequences (id) NOT VALID;

ALTER TABLE "public"."sequence_steps" VALIDATE CONSTRAINT "sequence_steps_sequence_id_fkey";

ALTER TABLE "public"."sequences" ADD CONSTRAINT "sequences1_id_key" UNIQUE USING INDEX "sequences1_id_key";

ALTER TABLE "public"."sequences" ADD CONSTRAINT "sequences_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."sequences" VALIDATE CONSTRAINT "sequences_company_id_fkey";
