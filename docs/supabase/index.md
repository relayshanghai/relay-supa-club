# Creating changes to the database

When creating a change to the database, it is recommended that you create granular changes.

e.g. Here you add column `foo` first and create foreign key after.

    - 0_add_column_foo.sql
    - 1_create_foo_fkey.sql

The whole idea is to provide developers a way to track these changes on a "micro" level (and revert if needed).

## I have a lot of changes. Should I create a migration file for each change I do?

No, you can actually create one big migration and split it to several files. Make sure that they are named synchronously though!

e.g. You currently have `01234_big_update.sql`, split it into

    - 01234_update1.sql
    - 01235_update2.sql
    - 01236_update3.sql

## How should I start?

1. Modify the database via three (3) methods:

-   SQL files

```bash
supabase migration new new_column
```

-   Using [db script](db-script.md)

```
supabase/db.sh --help
```

-   Supabase Studio

    Visit http://localhost:54323/project/default/editor

2. Persist your changes to the local database

    If you changed the database using Supabase studio, skip this step.

```bash
# push policies or functions
supabase/db.sh push_policies
supabase/db.sh push_dbfn

# or do this if you manually added a migration file
supabase db reset
```

3. Create a migration file based on your changes

```bash
# create a migration file (you might not need this if you created a migration manually)
supabase db diff --file=<migration_name>

# generate database types
supabase gen types typescript --local --schema=public > types/supabase.ts
# or
supabase/db.sh gen_db_types
```

4. Commit & Push your changes

```bash
# or you can use your git client
git commit -am "My database changes"

# push your migration and wait for tests to pass
git push -u <branch-name>
```

_Reference: [database migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)_

---

# Discarding database changes

Currently, there is no way to rollback single migrations so we will need to reset the database from the start.
This will clear everything in your local database and apply the existing migrations

1. Run database reset

```bash
supabase db reset
```

# Testing your policies and functions

To have a better testing experience, we made our own way of testing by talking directly to the local supabase docker.

1. Create a test

```bash
./supabase/db.sh create_test <test_name>
```

You can include (`\include`) external sql files from these directories:

-   `/tmp/database/policies` for policies
-   `/tmp/database/functions` for functions

2. Run the test

```bash
# run all tests
./supabase/db.sh db_test

# run specific tests
./supabase/db.sh db_test <test1> <test2>
```

_References:_

-   [pgTap](https://pgtap.org/documentation.html)
-   [usebasejump's supabase test helpers](https://github.com/usebasejump/supabase-test-helpers)

# Deploying database changes

1. Open a PR to `main` branch

2. Once your PR is approved by peers, merge and wait for the github workflow to pass.

_Reference: [deploy a migration](https://supabase.com/docs/guides/cli/managing-environments#deploy-a-migration)_

---

# Adding sample data

1. Edit the `./supabase/seed.sql` file

2. Apply the changes

```bash
supabase db reset
```
