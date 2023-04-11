drop policy "Public profiles are viewable by everyone." on "public"."profiles";

drop policy "Users can insert their own profile." on "public"."profiles";

drop policy "Users can update own profile." on "public"."profiles";

alter table "public"."profiles" enable row level security;

create policy "profiles_delete"
on "public"."profiles"
as permissive
for delete
to public
using (false);


create policy "profiles_insert"
on "public"."profiles"
as permissive
for insert
to public
with check (false);


create policy "profiles_select"
on "public"."profiles"
as permissive
for select
to public
using (((id = auth.uid()) OR is_relay_employee()));


create policy "profiles_update"
on "public"."profiles"
as permissive
for update
to public
using (false);



