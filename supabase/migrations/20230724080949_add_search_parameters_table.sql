CREATE TABLE "public"."search_parameters" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "hash" character varying NOT NULL,
  "data" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now()
);

ALTER TABLE "public"."search_parameters" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX search_parameters_hash_key ON public.search_parameters USING btree (hash);

CREATE UNIQUE INDEX search_parameters_pkey ON public.search_parameters USING btree (id);

ALTER TABLE "public"."search_parameters" ADD CONSTRAINT "search_parameters_pkey" PRIMARY KEY USING INDEX "search_parameters_pkey";

ALTER TABLE "public"."search_parameters" ADD CONSTRAINT "search_parameters_hash_key" UNIQUE USING INDEX "search_parameters_hash_key";
