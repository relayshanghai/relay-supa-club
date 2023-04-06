create table "public"."influencer_profiles" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "url" text,
    "platform" text
);
