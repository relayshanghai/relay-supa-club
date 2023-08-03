-- Enable log rotation by creating the following cron job in the database
--
-- select cron.schedule (
--     'rotate-vercel-logs',
--     '0 0 1 * *',
--     $$ SELECT rotate_vercel_logs(); $$
-- );

CREATE OR REPLACE FUNCTION rotate_vercel_logs()
RETURNS void
LANGUAGE plpgsql
AS $$
  BEGIN
    DELETE FROM vercel_logs WHERE timestamp < NOW() - INTERVAL '30 days';
  END;
$$;
