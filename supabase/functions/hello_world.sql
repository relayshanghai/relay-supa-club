CREATE OR REPLACE FUNCTION relay_hello_world()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'Hello Relay!';
END;
$$;
