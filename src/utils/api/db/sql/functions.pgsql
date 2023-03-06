
-- There is no way to make raw sql queries using the supabase client
-- You can only add functions to the db by running this code in the sql editor in the dashboard
-- Note that `security definer` is what gives us permission to edit the auth schema
-- NEVER ADD THIS TO THE REAL DATABASE, ONLY USE IT WITH THE TESTING DATABASE
CREATE OR REPLACE FUNCTION truncate_all_tables(schema_name TEXT)
RETURNS void AS $$
DECLARE
    table_name TEXT;
BEGIN
    FOR table_name IN
        SELECT t.table_name
        FROM information_schema.tables t
        WHERE t.table_schema = schema_name
        AND t.table_type = 'BASE TABLE'
    LOOP
        EXECUTE 'TRUNCATE TABLE ' || schema_name || '.' || table_name || ' CASCADE;';
    END LOOP;
END;
$$ LANGUAGE 'plpgsql' security definer;

-- TODO: add the other existing functions. Also with the supabase config options. 