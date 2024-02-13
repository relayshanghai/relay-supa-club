alter table "public"."outreach_email_templates" add column "description" text;

alter table "public"."outreach_email_templates" add column "name" text not null;

alter table "public"."outreach_template_variables" drop column "value";

alter table "public"."outreach_template_variables" add column "category" character varying(255) not null;


