create table
    "public"."influencer_categories" (
        "id" uuid not null default uuid_generate_v4 (),
        "created_at" timestamp
        with
            time zone default now (),
            "category" text,
            "influencer" uuid
    );

create table
    "public"."influencers" (
        "id" uuid not null default uuid_generate_v4 (),
        "created_at" timestamp
        with
            time zone default now (),
            "name" text,
            "email" text
    );

create table
    "public"."posts_content" (
        "id" uuid not null default uuid_generate_v4 (),
        "created_at" timestamp
        with
            time zone default now (),
            "url" text,
            "like_count" integer,
            "view_count" integer,
            "comment_count" integer,
            "is_reusable" boolean,
            "publish_date" timestamp
        with
            time zone,
            "type" text,
            "social_media_platform" uuid,
            "influencer" uuid,
            "campaign" uuid
    );

create table
    "public"."social_media_platforms" (
        "id" uuid not null default uuid_generate_v4 (),
        "created_at" timestamp
        with
            time zone default now (),
            "name" text,
            "url" text
    );

create table
    "public"."social_media_profiles" (
        "id" uuid not null default uuid_generate_v4 (),
        "created_at" timestamp
        with
            time zone default now (),
            "url" text,
            "platform" text
    );

CREATE UNIQUE INDEX influencer_categories_pkey ON public.influencer_categories USING btree (id);

CREATE UNIQUE INDEX influencers_pkey ON public.influencers USING btree (id);

CREATE UNIQUE INDEX posts_content_pkey ON public.posts_content USING btree (id);

CREATE UNIQUE INDEX social_media_platforms_pkey ON public.social_media_platforms USING btree (id);

CREATE UNIQUE INDEX social_media_profiles_pkey ON public.social_media_profiles USING btree (id);

alter table
    "public"."influencer_categories" add constraint "influencer_categories_pkey" PRIMARY KEY using index "influencer_categories_pkey";

alter table
    "public"."influencers" add constraint "influencers_pkey" PRIMARY KEY using index "influencers_pkey";

alter table
    "public"."posts_content" add constraint "posts_content_pkey" PRIMARY KEY using index "posts_content_pkey";

alter table
    "public"."social_media_platforms" add constraint "social_media_platforms_pkey" PRIMARY KEY using index "social_media_platforms_pkey";

alter table
    "public"."social_media_profiles" add constraint "social_media_profiles_pkey" PRIMARY KEY using index "social_media_profiles_pkey";

alter table
    "public"."influencer_categories" add constraint "influencer_categories_influencer_fkey" FOREIGN KEY (influencer) REFERENCES influencers (id) not valid;

alter table
    "public"."influencer_categories" validate constraint "influencer_categories_influencer_fkey";

alter table
    "public"."posts_content" add constraint "posts_content_campaign_fkey" FOREIGN KEY (campaign) REFERENCES campaigns (id) not valid;

alter table
    "public"."posts_content" validate constraint "posts_content_campaign_fkey";

alter table
    "public"."posts_content" add constraint "posts_content_influencer_fkey" FOREIGN KEY (influencer) REFERENCES influencers (id) not valid;

alter table
    "public"."posts_content" validate constraint "posts_content_influencer_fkey";

alter table
    "public"."posts_content" add constraint "posts_content_social_media_platform_fkey" FOREIGN KEY (social_media_platform) REFERENCES social_media_platforms (id) not valid;

alter table
    "public"."posts_content" validate constraint "posts_content_social_media_platform_fkey";
