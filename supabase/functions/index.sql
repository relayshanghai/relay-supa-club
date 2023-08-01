BEGIN;

\include ./supabase/functions/is_relay_employee.sql
\include ./supabase/functions/is_company_member.sql
\include ./supabase/functions/is_company_member_of_campaign.sql
\include ./supabase/functions/is_activated_account.sql

COMMIT;
