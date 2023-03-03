-- WIP
-- Use these policies by running them in the supabase dashboard sql editor
-- Delete a policy by running `DROP POLICY <policy_name> ON <table_name>;`
-- e.g. `DROP POLICY edit_own_company ON public.companies;`
CREATE POLICY edit_own_company ON public.companies USING (
    id = auth.uid ()
    AND company_id IN (
        SELECT
            company_id
        FROM
            public.profiles
        WHERE
            id = auth.uid ()
    )
) FOR
UPDATE
WITH
    CHECK (
        id = auth.uid ()
        AND company_id IN (
            SELECT
                company_id
            FROM
                public.profiles
            WHERE
                id = auth.uid ()
        )
    );
