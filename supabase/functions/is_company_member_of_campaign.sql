CREATE OR REPLACE FUNCTION is_company_member_of_campaign(target_campaign_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
    DECLARE
      target_company_id UUID;
    BEGIN
      SELECT company_id INTO target_company_id FROM campaigns WHERE id = target_campaign_id;
      RETURN (SELECT company_id FROM profiles WHERE id = auth.uid()) = target_company_id;
    END;
  $$;
