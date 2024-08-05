CREATE OR REPLACE FUNCTION public.is_activated_account()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$BEGIN
    RETURN (SELECT subscription_data->>'status' FROM subscriptions WHERE company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())) = 'active' 
    OR (SELECT subscription_data->>'status' FROM subscriptions WHERE company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())) = 'trialing';
END;$function$;
