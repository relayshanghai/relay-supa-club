CREATE OR REPLACE FUNCTION public.fetch_email_count_per_account_by_date(account_id CHARACTER VARYING)
RETURNS TABLE (
  date DATE,
  step_id UUID,
  emails_count BIGINT
)
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        date (email_send_at at time zone 'America/Chicago') AS send_date,
        sequence_step_id AS step_id,
        count(id) AS emails_count
    FROM
        sequence_emails
    WHERE
        email_engine_account_id = account_id
        AND email_send_at > now() - interval '1 day'
    GROUP BY
        date (email_send_at at time zone 'America/Chicago'),
        step_id;
END;
$function$;
