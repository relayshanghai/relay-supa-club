ALTER TABLE "public"."profiles"
ADD COLUMN "phone_verified_at" timestamp with time zone DEFAULT NULL;

-- to setup all existed profiles phone_verified_at to created_at so all existing profiles are verified
UPDATE "public"."profiles" SET "phone_verified_at" = "profiles"."created_at";
