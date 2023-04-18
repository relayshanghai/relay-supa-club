alter table "public"."campaigns" enable row level security;

set check_function_bodies = off;

create or replace function public.is_company_member(target_company_id uuid)
returns boolean
language plpgsql
security definer
as $function$
    BEGIN
    RETURN (SELECT company_id FROM profiles WHERE id = auth.uid()) = target_company_id;
    END;
  $function$;

create policy "campaigns_all"
on "public"."campaigns"
as permissive
for all
to public
using ((is_company_member(company_id) or is_relay_employee()));
