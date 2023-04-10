create table "public"."influencer_categories" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "category" text,
    "influencer" uuid
);
