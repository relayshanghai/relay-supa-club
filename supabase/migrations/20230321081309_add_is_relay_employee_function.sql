set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_relay_employee()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
    BEGIN
    RETURN (SELECT user_role FROM profiles WHERE id = auth.uid()) = 'relay_employee';
    END;
  $function$
;
