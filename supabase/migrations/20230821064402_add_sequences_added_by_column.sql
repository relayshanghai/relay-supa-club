ALTER TABLE "public"."sequences" ADD COLUMN "manager_name" text;

ALTER TABLE "public"."sequences" ADD COLUMN "sdded_by" uuid;

ALTER TABLE "public"."sequences" ADD CONSTRAINT "sequences_sdded_by_fkey" FOREIGN KEY (sdded_by) REFERENCES profiles (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."sequences" VALIDATE CONSTRAINT "sequences_sdded_by_fkey";
