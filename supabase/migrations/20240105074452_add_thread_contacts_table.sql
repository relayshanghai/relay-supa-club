CREATE TABLE "public"."thread_contacts" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "thread_id" text NOT NULL,
  "email_contact_id" uuid NOT NULL,
  "type" character varying NOT NULL,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "deleted_at" timestamp without time zone
);

ALTER TABLE "public"."thread_contacts" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX thread_contacts_pkey ON public.thread_contacts USING btree (id);

ALTER TABLE "public"."thread_contacts" ADD CONSTRAINT "thread_contacts_pkey" PRIMARY KEY USING INDEX "thread_contacts_pkey";

ALTER TABLE "public"."thread_contacts" ADD CONSTRAINT "thread_contacts_email_contact_id_fkey" FOREIGN KEY (email_contact_id) REFERENCES email_contacts (id) NOT VALID;

ALTER TABLE "public"."thread_contacts" VALIDATE CONSTRAINT "thread_contacts_email_contact_id_fkey";

ALTER TABLE "public"."thread_contacts" ADD CONSTRAINT "thread_contacts_thread_id_fkey" FOREIGN KEY (thread_id) REFERENCES threads (thread_id) NOT VALID;

ALTER TABLE "public"."thread_contacts" VALIDATE CONSTRAINT "thread_contacts_thread_id_fkey";
