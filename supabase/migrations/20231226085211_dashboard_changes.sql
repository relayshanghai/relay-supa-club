drop trigger if exists "company" on "public"."companies"
drop trigger if exists "signup" on "public"."profiles"
drop policy "Enable insert for authenticated users only" on "public"."campaigns"
drop function if exists "public"."handle_new_user"()
alter table "public"."campaigns" alter column "updated_at" set default now()
alter table "public"."logs" disable row level security
set check_function_bodies = off
CREATE OR REPLACE FUNCTION public.create_queue_worker_2(worker_name text, url text, token text, schedule text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    PERFORM cron.schedule(
      worker_name,
      schedule,
      format($cmd$SELECT content FROM http((
            'POST', %L,
            ARRAY[
                http_header('x-scheduler-token', %L),
                http_header('x-scheduler-worker-id', %L)
            ],
            '', ''
        )::http_request);$cmd$, url, token, worker_name)
    );
END;
$function$
create or replace view "public"."searches_per_user" as  SELECT companies.name,
    companies.website,
    companies.searches_limit,
    companies.subscription_status,
    companies.subscription_start_date
   FROM companies
CREATE TRIGGER company AFTER INSERT OR UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://app.relay.club/api/slack/create', 'POST', '{"Content-type":"application/json"}', '{"token":"https://hooks.slack.com/services/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"}', '1000')
CREATE TRIGGER signup AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://app.relay.club/api/slack/create', 'POST', '{"Content-type":"application/json"}', '{"token":"https://hooks.slack.com/services/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"}', '1000')