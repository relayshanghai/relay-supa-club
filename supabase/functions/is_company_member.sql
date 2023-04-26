CREATE OR REPLACE FUNCTION is_company_member(target_company_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
    BEGIN
    RETURN (SELECT company_id FROM profiles WHERE id = auth.uid()) = target_company_id;
    END;
  $$;
