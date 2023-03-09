-- WIP
-- Use these policies by running them in the supabase dashboard sql editor
-- Delete a policy by running `DROP POLICY <policy_name> ON <table_name>;`
-- e.g. `DROP POLICY edit_own_company ON public.companies;`
CREATE POLICY edit_own_company ON public.companies FOR
UPDATE USING (
    -- user who's profile.id matchs auth.uid(), and who's profile.company_id matches the company.id
    id = company_id IN (
        SELECT
            company_id
        FROM
            public.profiles
        WHERE
            id = auth.uid ()
    )
    --  AND profile.role is 'relay_employee'
    --  AND profile.role is 'relay_admin'
    AND role IN ('relay_employee', 'relay_admin')
)