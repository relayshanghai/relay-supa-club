-- Means the company has a subscription. Note that cancelled accounts should still be able to use the platform unless their subscription end date has passed. That logic is handled in the middleware.
CREATE OR REPLACE FUNCTION is_activated_account()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
    BEGIN
    RETURN (SELECT subscription_status FROM companies WHERE id = (SELECT company_id FROM profiles WHERE id = auth.uid())) = 'active' OR (SELECT subscription_status FROM companies WHERE id = (SELECT company_id FROM profiles WHERE id = auth.uid())) = 'trial' OR (SELECT subscription_status FROM companies WHERE id = (SELECT company_id FROM profiles WHERE id = auth.uid())) = 'paused' OR (SELECT subscription_status FROM companies WHERE id = (SELECT company_id FROM profiles WHERE id = auth.uid())) = 'canceled';
    END;
  $$;
