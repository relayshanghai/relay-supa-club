CREATE OR REPLACE FUNCTION public.create_queue_worker(worker_name text, url text, token text, schedule text)
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
        )::http_request)$cmd$, url, token, worker_name)
    );
END;
$function$;
