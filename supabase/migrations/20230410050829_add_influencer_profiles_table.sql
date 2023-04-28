CREATE TABLE "public"."influencer_social_profiles" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "created_at" timestamp with time zone DEFAULT now(),
  "url" text,
  "platform" text,
  "influencer_id" uuid
);

ALTER TABLE "public"."influencer_social_profiles" ENABLE ROW LEVEL SECURITY;
