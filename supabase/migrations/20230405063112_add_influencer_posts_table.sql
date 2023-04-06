create table "public"."influencer_posts" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp without time zone default (now() AT TIME ZONE 'utc'::text),
    "url" text,
    "like_count" integer,
    "view_count" integer,
    "comment_count" integer,
    "is_reusable" boolean,
    "publish_date" timestamp without time zone default (now() AT TIME ZONE 'utc'::text),
    "type" text,
    "influencer" uuid,
    "campaign" uuid,
    "platform" text,
    "updated_at" timestamp without time zone default (now() AT TIME ZONE 'utc'::text)
);
