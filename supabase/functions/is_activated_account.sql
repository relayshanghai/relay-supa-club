-- Means the company has a subscription
CREATE OR REPLACE FUNCTION is_activated_account()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
    BEGIN
    RETURN (SELECT subscription_status FROM companies WHERE id = (SELECT company_id FROM profiles WHERE id = auth.uid())) = 'active' OR (SELECT subscription_status FROM companies WHERE id = (SELECT company_id FROM profiles WHERE id = auth.uid())) = 'trial';
    END;
  $$;
