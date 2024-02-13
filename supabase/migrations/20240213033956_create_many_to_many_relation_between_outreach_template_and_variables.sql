create table "public"."outreach_email_template_variables_relation" (
    "id" uuid not null default gen_random_uuid(),
    "outreach_email_template_id" uuid not null,
    "outreach_template_variable_id" uuid not null
);


alter table "public"."outreach_email_template_variables_relation" enable row level security;

CREATE UNIQUE INDEX outreach_email_template_variables_relation_pkey ON public.outreach_email_template_variables_relation USING btree (id);

alter table "public"."outreach_email_template_variables_relation" add constraint "outreach_email_template_variables_relation_pkey" PRIMARY KEY using index "outreach_email_template_variables_relation_pkey";

alter table "public"."outreach_email_template_variables_relation" add constraint "outreach_email_template_variables_relation_outreach_email_templ" FOREIGN KEY (outreach_email_template_id) REFERENCES outreach_email_templates(id) ON DELETE CASCADE not valid;

alter table "public"."outreach_email_template_variables_relation" validate constraint "outreach_email_template_variables_relation_outreach_email_templ";

alter table "public"."outreach_email_template_variables_relation" add constraint "outreach_email_template_variables_relation_outreach_template_va" FOREIGN KEY (outreach_template_variable_id) REFERENCES outreach_template_variables(id) ON DELETE CASCADE not valid;

alter table "public"."outreach_email_template_variables_relation" validate constraint "outreach_email_template_variables_relation_outreach_template_va";

grant delete on table "public"."outreach_email_template_variables_relation" to "anon";

grant insert on table "public"."outreach_email_template_variables_relation" to "anon";

grant references on table "public"."outreach_email_template_variables_relation" to "anon";

grant select on table "public"."outreach_email_template_variables_relation" to "anon";

grant trigger on table "public"."outreach_email_template_variables_relation" to "anon";

grant truncate on table "public"."outreach_email_template_variables_relation" to "anon";

grant update on table "public"."outreach_email_template_variables_relation" to "anon";

grant delete on table "public"."outreach_email_template_variables_relation" to "authenticated";

grant insert on table "public"."outreach_email_template_variables_relation" to "authenticated";

grant references on table "public"."outreach_email_template_variables_relation" to "authenticated";

grant select on table "public"."outreach_email_template_variables_relation" to "authenticated";

grant trigger on table "public"."outreach_email_template_variables_relation" to "authenticated";

grant truncate on table "public"."outreach_email_template_variables_relation" to "authenticated";

grant update on table "public"."outreach_email_template_variables_relation" to "authenticated";

grant delete on table "public"."outreach_email_template_variables_relation" to "service_role";

grant insert on table "public"."outreach_email_template_variables_relation" to "service_role";

grant references on table "public"."outreach_email_template_variables_relation" to "service_role";

grant select on table "public"."outreach_email_template_variables_relation" to "service_role";

grant trigger on table "public"."outreach_email_template_variables_relation" to "service_role";

grant truncate on table "public"."outreach_email_template_variables_relation" to "service_role";

grant update on table "public"."outreach_email_template_variables_relation" to "service_role";


