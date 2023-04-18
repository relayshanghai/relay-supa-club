BEGIN;
-- insert policy files here
\include ./supabase/policies/profiles_delete.policy.sql
\include ./supabase/policies/profiles_insert.policy.sql
\include ./supabase/policies/profiles_select.policy.sql
\include ./supabase/policies/profiles_update.policy.sql
\include ./supabase/policies/campaigns_all.policy.sql
COMMIT;
