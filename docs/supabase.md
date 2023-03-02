Delete a user:

TODO: investigate setting the profiles table to cascade delete: https://github.com/supabase/storage-api/issues/65

```sql
delete from campaign_notes where id = '944be6e7-5ac1-4920-b23a-04faac1c610f';
delete from profiles where id = '944be6e7-5ac1-4920-b23a-04faac1c610f';
delete from usages where user_id = '944be6e7-5ac1-4920-b23a-04faac1c610f';
delete from auth.users where id = '944be6e7-5ac1-4920-b23a-04faac1c610f';
```

to backup the database:

get the database url connection string from supabase dashboard project settings > database > connection string

```bash
pg_dump --schema=public -h db.<replace-this>.supabase.co -p 5432 -d postgres -U postgres > backup.sql
```

It will prompt you for the db password you can find in bitwarden under supabase

to restore the database (or copy it to another database):

```bash
psql -h db.<replace-this>.supabase.co -p 5432 -d postgres -U postgres < backup.sql
```
