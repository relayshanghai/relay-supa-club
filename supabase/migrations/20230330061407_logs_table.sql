create table "public"."logs" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone default now(),
    "type" text not null,
    "message" text,
    "data" jsonb
);


CREATE UNIQUE INDEX logs_pkey ON public.logs USING btree (id);

alter table "public"."logs" add constraint "logs_pkey" PRIMARY KEY using index "logs_pkey";


