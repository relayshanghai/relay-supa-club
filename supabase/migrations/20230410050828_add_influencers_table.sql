create table "public"."influencers" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "name" text,
    "email" text,
    "address" text,
    "avatar_url" text
);
