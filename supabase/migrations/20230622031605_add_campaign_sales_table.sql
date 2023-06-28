CREATE TABLE "public"."sales" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "created_at" timestamp with time zone DEFAULT now(),
  "amount" numeric NOT NULL,
  "campaign_id" uuid,
  "company_id" uuid NOT NULL
);


CREATE UNIQUE INDEX sales_pkey ON public.sales USING btree (id);

ALTER TABLE "public"."sales" ADD CONSTRAINT "sales_pkey" PRIMARY KEY USING INDEX "sales_pkey";

ALTER TABLE "public"."sales" ADD CONSTRAINT "sales_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES campaigns (id) ON DELETE SET NULL NOT VALID;

ALTER TABLE "public"."sales" VALIDATE CONSTRAINT "sales_campaign_id_fkey";

ALTER TABLE "public"."sales" ADD CONSTRAINT "sales_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."sales" VALIDATE CONSTRAINT "sales_company_id_fkey";
