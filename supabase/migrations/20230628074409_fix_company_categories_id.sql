ALTER TABLE "public"."company_categories" DROP CONSTRAINT IF EXISTS "company_categories_pkey";

DROP INDEX IF EXISTS public.company_categories_pkey;

ALTER TABLE public.company_categories DROP COLUMN id;

ALTER TABLE company_categories ADD COLUMN id UUID NOT NULL DEFAULT (uuid_generate_v4());

CREATE UNIQUE INDEX company_categories_pkey ON public.company_categories USING btree (id);

ALTER TABLE "public"."company_categories" ADD CONSTRAINT "company_categories_pkey" PRIMARY KEY USING INDEX "company_categories_pkey";
