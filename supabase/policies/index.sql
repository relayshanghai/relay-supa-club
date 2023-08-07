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
\include ./supabase/policies/campaign_creators_all.policy.sql
\include ./supabase/policies/deny_all_policies.policy.sql
\include ./supabase/policies/influencer_social_profiles_all.policy.sql
\include ./supabase/policies/addresses_all.policy.sql
\include ./supabase/policies/sequence_influencers_all.policy.sql
\include ./supabase/policies/sequence_steps_all.policy.sql
\include ./supabase/policies/sequences_all.policy.sql
\include ./supabase/policies/sequence_emails_all.policy.sql

COMMIT;
