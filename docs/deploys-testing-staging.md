# Domains

Domains are set at
https://vercel.com/relay-club/relay-supa-club/settings/domains
Use the DNS settings they suggest and add the records to aliyun

# Vercel environments

Set environment variables for these different deploys at https://vercel.com/relay-club/relay-supa-club/settings/environment-variables

# Vercel previews

Previews use the TEST_MODE stripe keys, and the production database by default

# Staging

Staging has the same settings as previews. Staging is connected to production database.
To use the staging site https://staging-app.relay.club, merge your work to the `staging` branch and push it.

# Testing

Testing has its own database. It is called 'testing', under the relayclub projects in supabase. This is set with the `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_URL` environment variables in vercel. These variables can be found in the supabase dashboard under the relayclub testing project > settings > API > Project url and Project API keys.
To use the testing site https://testing-app.relay.club, merge your work to the `testing` branch and push it.

Note that when we migrate the database (see supabase.md), we are not able to migrate the auth data, so all the users will be lost. We will need to create new users for testing.
