SET check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.rotate_vercel_logs()
RETURNS void
LANGUAGE plpgsql
AS $function$
  BEGIN
    DELETE FROM vercel_logs WHERE timestamp < NOW() - INTERVAL '30 days';
  END;
$function$;
