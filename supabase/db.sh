#!/bin/bash

db_host=${PGHOST:-localhost}
db_port=${PGPORT:-54322}
db_user=${PGUSER:-postgres}
db_name=${PGDATABASE:-postgres}

script_name=$0

# set editor
editor=${EDITOR:-vim}

if command -v code &> /dev/null; then
    editor=code
fi

if command -v subl &> /dev/null; then
    editor=subl
fi

# bufio.Scanner fix
export SUPABASE_SCANNER_BUFFER_SIZE=5mb

# Check if psql command exists
function check_psql {
    if ! command -v psql &> /dev/null
    then
        echo "psql is not installed. Please install psql and try again."
        exit 1
    fi
}

function drop_database_function {
    if [ -z "$1" ]
    then
        echo "Usage: drop_dbfn <function_name>"
        exit 1
    fi
    
    # Use psql to drop the function
    psql -h $db_host -p $db_port -U $db_user -d $db_name -c "DROP FUNCTION IF EXISTS relay_$1();"
    sed -i "/\/$1\.sql/d" ./supabase/functions/index.sql
}

function push_database_functions {
    file_path=./supabase/functions/index.sql

    if [ ! -f "$file_path" ]; then
      echo "Error: File $file_path does not exist"
      exit 1
    fi

    psql -h $db_host -p $db_port -U $db_user -d $db_name -f $file_path
}

function list_database_functions {
    psql -h $db_host -p $db_port -U $db_user -d $db_name -c "SELECT specific_schema,routine_name,data_type,external_language FROM information_schema.routines WHERE routine_type = 'FUNCTION' AND routine_schema = 'public' AND routine_name LIKE 'relay_%';"
}

function connect {
    psql -h $db_host -p $db_port -U $db_user -d $db_name
}

function create_database_functions {
    fn_name=${1:-hello_world}
    message=$(cat <<-END
-- Do not remove relay_* prefix
CREATE OR REPLACE FUNCTION relay_$fn_name()
RETURNS text
LANGUAGE plpgsql
AS \$\$
BEGIN
  RETURN 'Hello Relay!';
END;
\$\$;
END
)
    echo "$message" > "./supabase/functions/$fn_name.sql"
    echo "\include ./supabase/functions/$fn_name.sql" >> "./supabase/functions/index.sql"

    if [ -n "$editor" ]; then
        $editor ./supabase/functions/$fn_name.sql
    fi
}

function supabase {
    if ! npx supabase -v>/dev/null; then
        echo "Cannot run 'npx supabase'. Make sure you can use supabase in your cli"
        exit 1
    fi

    npx supabase $@
}

function save_password {
    read -s -p "Password: " password
    echo $db_host:$db_port:$db_name:$db_user:$password>>~/.pgpass
    chmod 600 ~/.pgpass
}

function create_test {
    test_name=$1

    if [ -z "$test_name" ]; then
        echo "$script_name create_test <test_name>"
        exit 1
    fi

    message=$(cat <<-END
begin;
select plan(1); -- no. of tests in the file

SELECT has_column('auth', 'users', 'id', 'id should exist');
-- SELECT has_function('function_name'); -- test function
-- SELECT policy_cmd_is('table', 'policy', 'command'); -- test policy

select * from finish(); -- end test
rollback;
END
)
    echo "$message" > "./supabase/tests/database/$test_name.test.sql"

    if [ -n "$editor" ]; then
        $editor ./supabase/tests/database/$test_name.test.sql
    fi
}

function create_policy {
    pl_name=$1
    tb_name=$2

    if [ -z "$pl_name" || -z "$tb_name" ] ; then
        echo "$script_name create_policy <policy_name> <table_name>"
        exit 1
    fi

    message=$(cat <<-END
CREATE POLICY $pl_name
ON $tb_name
FOR ALL
-- TO authenticated
USING (
    auth.uid() = id
);
-- WITH CHECK ()
END
)
    echo "$message" > "./supabase/policies/$pl_name.policy.sql"
    echo "\include ./supabase/policies/$pl_name.policy.sql" >> "./supabase/policies/index.sql"

    if [ -n "$editor" ]; then
        $editor ./supabase/policies/$pl_name.policy.sql
    fi
}

function list_policies {
    psql -h $db_host -p $db_port -U $db_user -d $db_name -c "SELECT schemaname,tablename,policyname,cmd,roles FROM pg_policies;"
}

function drop_policy {
    pl_name=$1
    tb_name=$2

    if [ -z "$pl_name" ] || [ -z "$tb_name" ] ; then
        echo "$script_name drop_policy <policy_name> <table_name>"
        exit 1
    fi

    # Use psql to drop the function
    psql -h $db_host -p $db_port -U $db_user -d $db_name -c "DROP POLICY IF EXISTS $pl_name on $tb_name;"
    sed -i "/\/$pl_name\.policy\.sql/d" ./supabase/policies/index.sql
}

function push_policies {
    file_path=./supabase/policies/index.sql

    if [ ! -f "$file_path" ]; then
      echo "Error: File $file_path does not exist"
      exit 1
    fi

    psql -h $db_host -p $db_port -U $db_user -d $db_name -f $file_path
}

function generate_database_types {
    npx supabase gen types typescript --local --schema=public > types/supabase.ts
}

function help {
message=$(cat <<-END
    $script_name <command> [params]

    Create a "database" function - Note that these are database functions (not edge functions)
        ./$script_name create_dbfn <function_name>

    List database functions - Show functions that have relay_* prefix
        ./$script_name list_dbfn

    Push database functions - Pushes ALL functions found in "./supabase/functions"
        ./$script_name push_dbfn

    Drop a database function:
        ./$script_name drop_dbfn <function_name>

    Use supabase cli - You can also use supabase commands directly without specifying supa
        ./$script_name supa

    Connect to database:
        ./$script_name connect

    Save password - Creates a ~/.pgpass file
        ./$script_name save_password

    Create test:
        ./$script_name create_test <test_name>

    Create policy:
        ./$script_name create_policy <policy_name> <table_name>

    List policies:
        ./$script_name list_policies

    Push policies - Pushes ALL policies found in "./supabase/policies"
        ./$script_name push_policies

    Drop a policy:
        ./$script_name drop_policy <policy_name> <table_name>
END
)

    echo "$message"
}

check_psql

fn=$1
shift

case $fn in
  "--help")
    help
    ;;
  "supa")
    supabase $@
    ;;
  "connect")
    connect $@
    ;;
  "create_dbfn")
    create_database_functions $@
    ;;
  "push_dbfn")
    push_database_functions
    ;;
  "list_dbfn")
    list_database_functions
    ;;
  "drop_dbfn")
    drop_database_function $@
    ;;
  "save_password")
    save_password
    ;;
  "create_test")
    create_test $@
    ;;
  "create_policy")
    create_policy $@
    ;;
  "list_policies")
    list_policies
    ;;
  "drop_policy")
    drop_policy $@
    ;;
  "push_policies")
    push_policies
    ;;
  "gen_db_types")
    generate_database_types
    ;;
  *)
    supabase $fn $@
    ;;
esac
