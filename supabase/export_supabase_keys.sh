#!/bin/bash;

status_output=$(npx supabase status)

anon_key=$(echo "$status_output" | sed -n 's/^.*anon key: \([^ ]*\).*$/\1/p')
service_role_key=$(echo "$status_output" | sed -n 's/^.*service_role key: \([^ ]*\).*$/\1/p')

echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$anon_key" >>$GITHUB_ENV
echo "SUPABASE_SERVICE_KEY=$service_role_key" >>$GITHUB_ENV

# For local debugging of the script, write to a temp file and comment out the 2 $GITHUB_ENV lines

# temp_env_file=".env.temp"

# echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$anon_key" >>$temp_env_file
# echo "SUPABASE_SERVICE_KEY=$service_role_key" >>$temp_env_file
