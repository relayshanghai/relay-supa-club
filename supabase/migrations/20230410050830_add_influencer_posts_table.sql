CREATE TABLE "public"."influencer_posts" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "created_at" timestamp without time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
  "url" text,
  "is_reusable" boolean,
  "publish_date" timestamp without time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
  "type" text,
  "influencer_id" uuid,
  "campaign_id" uuid,
  "platform" text,
  "updated_at" timestamp without time zone DEFAULT (now() AT TIME ZONE 'utc'::text)
);

ALTER TABLE "public"."influencer_posts" ENABLE ROW LEVEL SECURITY;
