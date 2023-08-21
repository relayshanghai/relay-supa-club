ALTER TABLE "public"."sequences" DROP CONSTRAINT "sequences_sdded_by_fkey";

ALTER TABLE "public"."sequences" DROP COLUMN "sdded_by";

ALTER TABLE "public"."sequences" ADD COLUMN "added_by" uuid;

ALTER TABLE "public"."sequences" ADD CONSTRAINT "sequences_added_by_fkey" FOREIGN KEY (added_by) REFERENCES profiles (id) ON DELETE CASCADE NOT VALID;

ALTER TABLE "public"."sequences" VALIDATE CONSTRAINT "sequences_added_by_fkey";
