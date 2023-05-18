CREATE TABLE "public"."influencer_categories" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "created_at" timestamp with time zone DEFAULT now(),
  "category" text,
  "influencer_id" uuid
);

ALTER TABLE "public"."influencer_categories" ENABLE ROW LEVEL SECURITY;
