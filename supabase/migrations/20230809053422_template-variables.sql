CREATE TABLE "public"."template_variables" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "name" text NOT NULL,
  "value" text NOT NULL,
  "key" text NOT NULL,
  "sequence_id" uuid NOT NULL,
  "required" boolean NOT NULL DEFAULT true
);


ALTER TABLE "public"."template_variables" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."sequence_steps" DROP COLUMN "params";

CREATE UNIQUE INDEX template_variables_pkey ON public.template_variables USING btree(id);

ALTER TABLE "public"."template_variables" ADD CONSTRAINT "template_variables_pkey" PRIMARY KEY USING INDEX "template_variables_pkey";

ALTER TABLE "public"."template_variables" ADD CONSTRAINT "template_variables_sequence_id_fkey" FOREIGN KEY (sequence_id) REFERENCES sequences (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."template_variables" VALIDATE CONSTRAINT "template_variables_sequence_id_fkey";

CREATE POLICY "template_variables_all"
ON "public"."template_variables"
AS PERMISSIVE
FOR ALL
TO public
USING (is_activated_account());
