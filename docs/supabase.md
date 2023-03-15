## Delete a user

TODO: investigate setting the profiles table to cascade delete: https://github.com/supabase/storage-api/issues/65

```sql
delete from campaign_notes where id = '944be6e7-5ac1-4920-b23a-04faac1c610f';
delete from profiles where id = '944be6e7-5ac1-4920-b23a-04faac1c610f';
delete from usages where user_id = '944be6e7-5ac1-4920-b23a-04faac1c610f';
delete from auth.users where id = '944be6e7-5ac1-4920-b23a-04faac1c610f';
```

## Backup the database

get the database url connection string from supabase dashboard project settings > database > connection string

```bash
pg_dump --schema=public -h db.<replace-this>.supabase.co -p 5432 -d postgres -U postgres > backup.sql
```

It will prompt you for the db password you can find in bitwarden under supabase

| note that this will not copy the auth data, so you will need to create new users in the new database

## Restore the database (or copy it to another database):

```bash
psql -h db.<replace-this>.supabase.co -p 5432 -d postgres -U postgres < backup.sql
```

gotchas:

-   make sure to reconnect the profile and auth tables after restoring the database. In database > tables > profile, edit columns, connect the foreign key of id to schema 'auth' table 'users', key 'id'
-   set up the new profile trigger. In database > Triggers click 'New Trigger' and set it up like this:

conditions to fire: table : users (auth.users)
events: insert
trigger type: after
function to trigger: handle_new_user
orientation: row

-   turn off email verification in auth > providers > email > confirm email

## Running locally

Requires:

-   Docker
-   Supabase CLI
-   Git

---

1. Copy `supabase/config.toml.example` to `supabase/config.toml`

2. Login to supabase

```
npx supabase login
```

Create a new access token [here](https://app.supabase.com/account/tokens)

3. Link supabase project to local

```bash
# List projects under your account
npx supabase projects list

# Copy the project's "ID" and link it
npx supabase link --project-ref <project-id>
```

4. Start supabase docker

```
npx supabase start
```

This should automatically run the docker image and migrations. You can access Supabase studio [here](http://localhost:54323)

---

### Issues / Errors

#### Error: bufio.Scanner: token too long - [issue](https://github.com/supabase/cli/issues/274#issuecomment-1278497195)

```bash
# Run this instead
SUPABASE_SCANNER_BUFFER_SIZE=5mb npx supabase start
```

#### Error: ERROR: schema "supabase_functions" does not exist - [issue](https://github.com/supabase/supabase/issues?q=is%3Aissue+is%3Aopen+supabase_functions)

You are probably using a database that has webhooks or functions.
These features are not yet available in the docker image as of writing.

---

### References

-   https://supabase.com/docs/guides/cli/local-development
-   https://supabase.com/docs/guides/cli/managing-environments

---

## Database Webhook

Database Webhooks allow you to send real-time data from your database to another system whenever a table event occurs. See more [here](https://supabase.com/docs/guides/database/webhooks).

To create a new database webhook:

1. Create an api handler for the webhook endpoint. See `api/slack/create.ts` for example.
2. go to Supabase Dashboard > Database > Webhooks. Click on `create a new webhook` button on the top right.
3. Fill in the form.
    - `Name` is to name this webhook.
    - `Table` is the table that you want to listen to.
    - `Events` is the data actions that will trigger this webhook. You can select multiple events.
    - `Type of hook` should be default `HTTP Request`.
    - `Method` should be `POST`.
    - `URL` is the endpoint that will receive the webhook payload.
        - In our example it should be `http://app.relay.club/api/slack/create` for production. And your branch's vercel preview url for staging.
        - You can use tool like [RequestBin](https://requestbin.com/) to generate an endpoint to test the webhook first. And use that test endpoint here when testing. As Supabase now does not seem to provide a way to see the request payload in live.
        - Also, for now there is no way to edit URL after it is created. So you will need to delete and recreate the webhook if you want to change the URL.
    - `HTTP Headers` & `HTTP Params` use as needed. As in the slack integration, we added the slack token in the `HTTP Params`.
4. Click `Create webhook` button.

---
