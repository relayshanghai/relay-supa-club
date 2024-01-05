CREATE OR REPLACE FUNCTION public.fetch_pending_jobs(job_queue character varying, job_status character varying, queue_limit integer, run_time timestamp with time zone)
RETURNS SETOF jobs
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    UPDATE jobs
    SET status = 'running'
    WHERE id IN (
        SELECT id
        FROM jobs
        WHERE status = job_status
            AND queue = job_queue
            AND run_at <= run_time
        ORDER BY run_at ASC, run_at ASC
        FOR UPDATE
        LIMIT queue_limit
    )
    RETURNING *; -- Return all columns from the updated rows
END;
$function$;
