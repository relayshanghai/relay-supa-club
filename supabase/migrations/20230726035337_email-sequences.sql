CREATE TABLE "public"."product" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "shop_url" text,
  "description" text,
  "price" double precision,
  "price_currency" text
);


CREATE TABLE "public"."sequence_influencer" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "added_by" text NOT NULL,
  "influencer_id" uuid NOT NULL,
  "username" text NOT NULL,
  "handle" text NOT NULL,
  "email" text,
  "avatar_url" text,
  "categories" text[] NOT NULL DEFAULT '{}'::text[],
  "sequence_step" smallint NOT NULL DEFAULT '0'::smallint,
  "last_email_open_status" text NOT NULL,
  "last_email_send_date" timestamp with time zone,
  "next_email_send_date" timestamp with time zone,
  "funnel_status" text NOT NULL,
  "tags" text[] NOT NULL DEFAULT '{}'::text[],
  "platform" text NOT NULL,
  "channel_url" text NOT NULL,
  "next_step" text,
  "scheduled_post_date" timestamp with time zone,
  "video_details" text,
  "rate_amount" double precision,
  "rate_currency" text,
  "real_name" text,
  "tracking_code" text,
  "address" text,
  "phone_number" text,
  "postal_code" text,
  "city" text,
  "state" text,
  "country" text
);


CREATE TABLE "public"."sequence_steps" (
  "id" uuid NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "name" text,
  "order" smallint NOT NULL DEFAULT '0'::smallint,
  "wait_time_hours" integer NOT NULL DEFAULT 0,
  "template_id" text NOT NULL,
  "params" text[] NOT NULL DEFAULT '{}'::text[],
  "sequence_id" uuid NOT NULL
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

CREATE UNIQUE INDEX product_pkey ON public.product USING btree(id);

CREATE UNIQUE INDEX sequence_influencer_pkey ON public.sequence_influencer USING btree(id);

CREATE UNIQUE INDEX sequence_steps_pkey ON public.sequence_steps USING btree(id);

CREATE UNIQUE INDEX sequences1_id_key ON public.sequences USING btree(id);

CREATE UNIQUE INDEX sequences1_pkey ON public.sequences USING btree(id);

ALTER TABLE "public"."product" ADD CONSTRAINT "product_pkey" PRIMARY KEY USING INDEX "product_pkey";

ALTER TABLE "public"."sequence_influencer" ADD CONSTRAINT "sequence_influencer_pkey" PRIMARY KEY USING INDEX "sequence_influencer_pkey";

ALTER TABLE "public"."sequence_steps" ADD CONSTRAINT "sequence_steps_pkey" PRIMARY KEY USING INDEX "sequence_steps_pkey";

ALTER TABLE "public"."sequences" ADD CONSTRAINT "sequences1_pkey" PRIMARY KEY USING INDEX "sequences1_pkey";

ALTER TABLE "public"."campaign_notes" ADD CONSTRAINT "campaign_notes_sequence_influencer_id_fkey" FOREIGN KEY (sequence_influencer_id) REFERENCES sequence_influencer (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."campaign_notes" VALIDATE CONSTRAINT "campaign_notes_sequence_influencer_id_fkey";

ALTER TABLE "public"."company_categories" ADD CONSTRAINT "company_categories_product_id_fkey" FOREIGN KEY (product_id) REFERENCES product (id) NOT VALID;

ALTER TABLE "public"."company_categories" VALIDATE CONSTRAINT "company_categories_product_id_fkey";

ALTER TABLE "public"."influencer_posts" ADD CONSTRAINT "influencer_posts_sequence_id_fkey" FOREIGN KEY (sequence_id) REFERENCES sequences (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."influencer_posts" VALIDATE CONSTRAINT "influencer_posts_sequence_id_fkey";

ALTER TABLE "public"."influencer_posts" ADD CONSTRAINT "influencer_posts_sequence_influencer_id_fkey" FOREIGN KEY (sequence_influencer_id) REFERENCES sequence_influencer (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."influencer_posts" VALIDATE CONSTRAINT "influencer_posts_sequence_influencer_id_fkey";

ALTER TABLE "public"."sequence_influencer" ADD CONSTRAINT "sequence_influencer_influencer_id_fkey" FOREIGN KEY (influencer_id) REFERENCES influencers (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."sequence_influencer" VALIDATE CONSTRAINT "sequence_influencer_influencer_id_fkey";

ALTER TABLE "public"."sequence_steps" ADD CONSTRAINT "sequence_steps_sequence_id_fkey" FOREIGN KEY (sequence_id) REFERENCES sequences (id) NOT VALID;

ALTER TABLE "public"."sequence_steps" VALIDATE CONSTRAINT "sequence_steps_sequence_id_fkey";

ALTER TABLE "public"."sequences" ADD CONSTRAINT "sequences1_id_key" UNIQUE USING INDEX "sequences1_id_key";

ALTER TABLE "public"."sequences" ADD CONSTRAINT "sequences_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."sequences" VALIDATE CONSTRAINT "sequences_company_id_fkey";
