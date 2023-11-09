CREATE OR REPLACE FUNCTION public.create_queue_worker(worker_name text, url text, token text, schedule text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    PERFORM cron.schedule(
      worker_name,
      schedule,
      $BD$
        SELECT content FROM http((
            'POST', url,
            ARRAY[
                http_header('x-scheduler-token', token),
                http_header('x-scheduler-worker-id',worker_name)
            ],
            '', ''
        )::http_request);
      $BD$
    );
END;
$function$;
