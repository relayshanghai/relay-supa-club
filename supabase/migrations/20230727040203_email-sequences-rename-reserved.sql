ALTER TABLE "public"."sequence_steps" DROP COLUMN "order";

ALTER TABLE "public"."sequence_steps" ADD COLUMN "step_number" smallint NOT NULL DEFAULT '0'::smallint;
