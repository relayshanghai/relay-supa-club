## Running locally

Requires:

-   Docker

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

Point the webapp to the local database by changing the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

Get the api rul, anon key and service key by running `npx supabase status`

```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<find with supabase status>
SUPABASE_SERVICE_KEY=<find with supabase status>
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
