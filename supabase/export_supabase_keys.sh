#!/bin/bash

status_output=$(npx supabase status)

anon_key=$(echo "$status_output" | grep -oP 'anon key: \K[^ ]+')
service_role_key=$(echo "$status_output" | grep -oP 'service_role key: \K[^ ]+')

echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$anon_key" >>$GITHUB_ENV
echo "SUPABASE_SERVICE_KEY=$service_role_key" >>$GITHUB_ENV
