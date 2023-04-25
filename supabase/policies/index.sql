BEGIN;
-- insert policy files here
\include ./supabase/policies/profiles_delete.policy.sql
\include ./supabase/policies/profiles_insert.policy.sql
\include ./supabase/policies/profiles_select.policy.sql
\include ./supabase/policies/profiles_update.policy.sql
\include ./supabase/policies/campaigns_all.policy.sql
\include ./supabase/policies/companies_select.policy.sql
\include ./supabase/policies/companies_delete.policy.sql
\include ./supabase/policies/companies_insert.policy.sql
\include ./supabase/policies/companies_update.policy.sql
COMMIT;
