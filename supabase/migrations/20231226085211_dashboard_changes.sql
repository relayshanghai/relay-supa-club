DROP TRIGGER IF EXISTS "company" ON "public"."companies";
DROP TRIGGER IF EXISTS "signup" ON "public"."profiles";
DROP FUNCTION IF EXISTS "public"."handle_new_user"();
ALTER TABLE "public"."campaigns" ALTER COLUMN "updated_at" SET DEFAULT now();
ALTER TABLE "public"."logs" DISABLE ROW LEVEL SECURITY;


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
$function$;
CREATE OR REPLACE VIEW "public"."searches_per_user" AS SELECT
  companies.name,
  companies.website,
  companies.searches_limit,
  companies.subscription_status,
  companies.subscription_start_date
FROM companies;
CREATE TRIGGER company AFTER INSERT OR UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://app.relay.club/api/slack/create', 'POST', '{"Content-type":"application/json"}', '{"token":"https://hooks.slack.com/services/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"}', '1000');
CREATE TRIGGER signup AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://app.relay.club/api/slack/create', 'POST', '{"Content-type":"application/json"}', '{"token":"https://hooks.slack.com/services/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"}', '1000');
