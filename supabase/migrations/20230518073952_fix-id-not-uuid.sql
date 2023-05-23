ALTER TABLE "public"."posts_performance" DROP CONSTRAINT "posts_performance_campaign_id_fkey";

ALTER TABLE "public"."posts_performance" DROP CONSTRAINT "posts_performance_influencer_id_fkey";

ALTER TABLE "public"."posts_performance" DROP CONSTRAINT "posts_performance_post_id_fkey";

ALTER TABLE "public"."posts_performance" DROP CONSTRAINT "posts_performance_pkey";

DROP INDEX IF EXISTS "public"."posts_performance_pkey";

DROP TABLE "public"."posts_performance";

CREATE TABLE "public"."posts_performance"(
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "created_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
  "campaign_id" uuid NOT NULL,
  "influencer_id" uuid NOT NULL,
  "post_id" uuid NOT NULL,
  "likes_total" numeric,
  "views_total" numeric,
  "comments_total" numeric,
  "orders_total" numeric,
  "sales_total" numeric,
  "sales_revenue" numeric,
  "updated_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text)
);

ALTER TABLE "public"."posts_performance" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX posts_performance_pkey ON public.posts_performance USING btree (id);

ALTER TABLE "public"."posts_performance" ADD CONSTRAINT "posts_performance_pkey" PRIMARY KEY USING INDEX "posts_performance_pkey";

ALTER TABLE "public"."posts_performance" ADD CONSTRAINT "posts_performance_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES campaigns (id) NOT VALID;

ALTER TABLE "public"."posts_performance" VALIDATE CONSTRAINT "posts_performance_campaign_id_fkey";

ALTER TABLE "public"."posts_performance" ADD CONSTRAINT "posts_performance_influencer_id_fkey" FOREIGN KEY (influencer_id) REFERENCES influencers (id) NOT VALID;

ALTER TABLE "public"."posts_performance" VALIDATE CONSTRAINT "posts_performance_influencer_id_fkey";

ALTER TABLE "public"."posts_performance" ADD CONSTRAINT "posts_performance_post_id_fkey" FOREIGN KEY (post_id) REFERENCES influencer_posts (id) NOT VALID;

ALTER TABLE "public"."posts_performance" VALIDATE CONSTRAINT "posts_performance_post_id_fkey";
