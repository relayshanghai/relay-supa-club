ALTER TABLE "public"."sequences" ADD COLUMN "manager_first_name" text;

ALTER TABLE "public"."sequences" ADD COLUMN "manager_id" uuid;

ALTER TABLE "public"."sequences" ADD CONSTRAINT "sequences_manager_id_fkey" FOREIGN KEY (manager_id) REFERENCES profiles (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."sequences" VALIDATE CONSTRAINT "sequences_manager_id_fkey";
