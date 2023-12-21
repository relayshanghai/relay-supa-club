CREATE OR REPLACE FUNCTION public.fetch_email_count_by_date(account_id CHARACTER VARYING)
RETURNS TABLE (
  date DATE,
  emails_count BIGINT,
  sequence_step_id UUID
)
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        date (email_send_at at time zone 'America/Chicago') AS send_date,
        sequence_step_id,
        count(id) AS emails_count
    FROM
        sequence_emails
    WHERE
        email_engine_account_id = account_id
        AND email_send_at > now() - interval '1 day'
    GROUP BY
        date (email_send_at at time zone 'America/Chicago'),
        sequence_step_id;
END;
$function$;
