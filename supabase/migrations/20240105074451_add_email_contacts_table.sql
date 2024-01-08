CREATE TABLE "public"."email_contacts" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" character varying,
  "address" character varying NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE "public"."email_contacts" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX email_contacts_address_key ON public.email_contacts USING btree (address);

CREATE UNIQUE INDEX email_contacts_pkey ON public.email_contacts USING btree (id);

ALTER TABLE "public"."email_contacts" ADD CONSTRAINT "email_contacts_pkey" PRIMARY KEY USING INDEX "email_contacts_pkey";

ALTER TABLE "public"."email_contacts" ADD CONSTRAINT "email_contacts_address_key" UNIQUE USING INDEX "email_contacts_address_key";
