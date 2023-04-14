create table "public"."datasource_cache" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "data" json,
    "key" character varying,
    "updated_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text)
);

alter table "public"."datasource_cache" enable row level security;

CREATE UNIQUE INDEX datasource_cache_pkey ON public.datasource_cache USING btree (id);

alter table "public"."datasource_cache" add constraint "datasource_cache_pkey" PRIMARY KEY using index "datasource_cache_pkey";
