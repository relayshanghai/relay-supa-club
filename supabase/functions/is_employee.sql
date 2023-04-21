CREATE OR REPLACE FUNCTION is_relay_employee()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
    BEGIN
    RETURN (SELECT user_role FROM profiles WHERE id = auth.uid()) = 'relay_employee';
    END;
  $$;
