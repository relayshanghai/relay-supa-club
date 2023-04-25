BEGIN;

\include ./supabase/functions/is_relay_employee.sql
\include ./supabase/functions/is_company_member.sql

COMMIT;
