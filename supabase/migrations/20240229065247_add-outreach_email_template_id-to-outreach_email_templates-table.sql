ALTER TABLE
"public"."sequence_steps"
ADD
COLUMN "outreach_email_template_id" uuid NULL;

ALTER TABLE
"public"."sequence_steps"
ADD
CONSTRAINT "outreach_email_template_sequence_step_fk" FOREIGN KEY (outreach_email_template_id) REFERENCES outreach_email_templates (id) ON DELETE CASCADE NOT VALID;
