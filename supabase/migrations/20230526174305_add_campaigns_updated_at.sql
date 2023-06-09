ALTER TABLE "public"."campaigns" ADD COLUMN "updated_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text);
