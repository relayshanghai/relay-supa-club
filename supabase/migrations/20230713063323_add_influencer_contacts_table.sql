CREATE TABLE "public"."influencer_contacts" (
  "id" uuid NOT NULL,
  "influencer_id" uuid,
  "type" text,
  "value" text
);


CREATE UNIQUE INDEX influencer_contacts_pkey ON public.influencer_contacts USING btree (id);

ALTER TABLE "public"."influencer_contacts" ADD CONSTRAINT "influencer_contacts_pkey" PRIMARY KEY USING INDEX "influencer_contacts_pkey";

ALTER TABLE "public"."influencer_contacts" ADD CONSTRAINT "influencer_contacts_influencer_id_fkey" FOREIGN KEY (influencer_id) REFERENCES influencers (id) NOT VALID;

ALTER TABLE "public"."influencer_contacts" VALIDATE CONSTRAINT "influencer_contacts_influencer_id_fkey";
