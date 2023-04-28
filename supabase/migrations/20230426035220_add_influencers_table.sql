CREATE TABLE "public"."influencers" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "created_at" timestamp with time zone DEFAULT now(),
  "name" text,
  "email" text,
  "address" text,
  "avatar_url" text,
  "is_recommended" boolean
);

ALTER TABLE "public"."influencers" ENABLE ROW LEVEL SECURITY;
