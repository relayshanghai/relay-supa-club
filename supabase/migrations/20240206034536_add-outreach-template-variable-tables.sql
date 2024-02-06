CREATE TYPE "public"."outreach_step" AS ENUM (
    'OUTREACH',
    'FIRST_FOLLOW_UP',
    'SECOND_FOLLOW_UP',
    'THIRD_FOLLOW_UP'
);

CREATE TABLE "public"."outreach_email_templates" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "step" OUTREACH_STEP NOT NULL,
    "template" TEXT,
    "subject" TEXT,
    "email_engine_template_id" TEXT NOT NULL,
    "company_id" UUID,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("company_id") REFERENCES companies (id) ON DELETE CASCADE
);

CREATE TABLE "public"."outreach_template_variables" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "company_id" UUID,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("company_id") REFERENCES companies (id) ON DELETE CASCADE,
    CONSTRAINT "outreach_template_variables_name_check" CHECK (
        ((name)::TEXT ~ '^[a-zA-Z_]+$'::TEXT)
    ),
    CONSTRAINT "outreach_template_variables_company_id_name_key" UNIQUE (
        "company_id", "name"
    )
);

ALTER TABLE "public"."outreach_email_templates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."outreach_template_variables" ENABLE ROW LEVEL SECURITY;
