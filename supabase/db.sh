#!/bin/bash

# You shouldn't need to change these envrioment variables developing locally.
db_host=${DBHOST:-localhost}
db_port=${DBPORT:-54322}
db_user=${DBUSER:-postgres}
db_name=${DBNAME:-postgres}

# first parameter
script_name=$0

# set editor
editor=${EDITOR:-vim}

# check if code command exists (so it will default to vscode if you have it available)
# `command` is a unix command to see if a command exists in the path
# `&> /dev/null` is a way to redirect the output to /dev/null (basically, don't show the output) dev/null is a special file that discards all input
# `>` is a way to redirect the output to a file, stdout is the default output
# `&>` also redirects the error output `stderr`
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
        # exit one is a unix command to exit the script with an error code
# to exit with a success code, use exit 0
        exit 1
    fi
}

function drop_db_function {
    # null check. If the first parameter of the function ($1) is null, then exit
    if [ -z "$1" ]
    then
        echo "Usage: drop_dbfn <function_name>"
        exit 1
    fi
    
    # Use psql to drop the function
    psql --host $db_host --port $db_port --username $db_user --dbname $db_name --command "DROP FUNCTION IF EXISTS relay_$1();"

    echo "Dropped $1. You still need to remove it from ./supabase/functions/index.sql"
}

function import_dbfn {
    file_path=./supabase/functions/index.sql

    if [ ! -f "$file_path" ]; then
      echo "Error: File $file_path does not exist"
      exit 1
    fi

    psql -h $db_host -p $db_port -U $db_user -d $db_name -f $file_path
}

function list_dbfn {
    psql -h $db_host -p $db_port -U $db_user -d $db_name -c "SELECT routine_name FROM information_schema.routines WHERE routine_type = 'FUNCTION' AND routine_schema = 'public';" | grep "relay_"
}

function connect {
    psql -h $db_host -p $db_port -U $db_user -d $db_name
}

function create_dbfn {
    fn_name=${1:-hello_world}
    message=$(cat <<-TEMPLATE
-- Do not remove relay_* prefix
CREATE OR REPLACE FUNCTION relay_$fn_name()
RETURNS text
LANGUAGE plpgsql
AS \$\$
BEGIN
  RETURN 'Hello Relay!';
END;
\$\$;
TEMPLATE
)
    echo "$message" > "./supabase/functions/$fn_name.sql" # > is a way to redirect the output to a file, stdout is the default output
    echo "\include ./supabase/functions/$fn_name.sql" >> "./supabase/functions/index.sql" # >> is a way to append the output to a file

    if [ -n "$editor" ]; then
        $editor ./supabase/functions/$fn_name.sql
    fi
}

function supabase {
    if ! npx supabase -v>/dev/null; then
        echo "Cannot run 'npx supabase'. Make sure you can use supabase in your cli"
        exit 1
    fi
    # $@ is a way to pass all the parameters to the function to the command
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
        echo "Test name is required"
        exit 1
    fi

    message=$(cat <<-TEMPLATE
begin;
select plan(1); -- no. of tests in the file

SELECT has_column('auth', 'users', 'id', 'id should exist');
-- SELECT has_function('function_name'); -- test function
-- SELECT policy_cmd_is('table', 'policy', 'command'); -- test policy

select * from finish(); -- end test
rollback;
TEMPLATE
)
    echo "$message" > "./supabase/tests/database/$test_name.test.sql"

    if [ -n "$editor" ]; then
        $editor ./supabase/tests/database/$test_name.test.sql
    fi
}

function create_policy {
    pl_name=$1
    tb_name=$2

    if [ -z "$pl_name" ]; then
        echo "Policy name is required"
        exit 1
    fi

    if [ -z "$tb_name" ]; then
        echo "Table name is required"
        exit 1
    fi

    message=$(cat <<-TEMPLATE
CREATE POLICY $pl_name
ON $tb_name
FOR ALL
-- TO authenticated
USING (
    auth.uid() = id
);
-- WITH CHECK ()
TEMPLATE
)
    echo "$message" > "./supabase/policies/$pl_name.policy.sql"
    echo "\include ./supabase/policies/$pl_name.policy.sql" >> "./supabase/policies/index.sql"

    if [ -n "$editor" ]; then
        $editor ./supabase/policies/$pl_name.policy.sql
    fi
}

function list_policies {
    psql -h $db_host -p $db_port -U $db_user -d $db_name -c "SELECT schemaname,tablename,policyname FROM pg_policies;"
}

function drop_policy {
    pl_name=$1
    tb_name=$2

    if [ -z "$pl_name" ]; then
        echo "Policy name is required"
        exit 1
    fi

    if [ -z "$tb_name" ]; then
        echo "Table name is required"
        exit 1
    fi

    # Use psql to drop the function
    psql -h $db_host -p $db_port -U $db_user -d $db_name -c "DROP POLICY IF EXISTS $pl_name on $tb_name;"
}

function import_policies {
    file_path=./supabase/policies/index.sql

    if [ ! -f "$file_path" ]; then
      echo "Error: File $file_path does not exist"
      exit 1
    fi

    psql -h $db_host -p $db_port -U $db_user -d $db_name -f $file_path
}

function gen_db_types {
    npx supabase gen types typescript --local --schema=public > types/supabase.ts
}

function help {
message=$(cat <<-END
    $script_name <command>

    Create a function:
        ./$script_name create_dbfn <function_name>

    Note that these are database functions (not edge functions)
    All functions created with this command will have a relay_* prefix
    This command creates a function in "./supabase/functions" and adds it to "./supabase/functions/index.sql"

    List functions:
        ./$script_name list_dbfn

    Show functions that have relay_* prefix

    Import functions:
        ./$script_name import_dbfn

    Imports all functions found in "./supabase/functions"
    
    Runs a postgres query to import all functions with relay_* prefix and adds them to the database that is connected based on what environment variables you have set for the DBHOST, DBPORT, DBUSER, DBNAME, and DBPASSWORD.

    Drop a function:
        ./$script_name drop_dbfn <function_name>

    Use supabase:
        ./$script_name supa

    You can also call supabase directly using this script

    Connect to database:
        ./$script_name connect

    Save password:
        ./$script_name save_password

    Creates a ~/.pgpass file

    Create test:
        ./$script_name create_test <test_name>

    Create policy:
        ./$script_name create_policy <policy_name> <table_name>

    List policies:
        ./$script_name list_policies

    Import policies:
        ./$script_name import_policies

    Runs a postgres query to import all functions with relay_* prefix and adds them to the database that is connected based on what environment variables you have set for the DBHOST, DBPORT, DBUSER, DBNAME, and DBPASSWORD.

    Import all policies found in "./supabase/policies"

    Drop a policy:
        ./$script_name drop_policy <policy_name> <table_name>

    You can specify psql arguments such as
    DBHOST (default: localhost)
    DBPORT (default: 54322)
    DBUSER (default: postgres)
    DBNAME (default: postgres)

    DBHOST=remote.db DBPORT=1234 DBUSER=john DBNAME=foo ./$script_name <command>
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
    create_dbfn $@
    ;;
  "import_dbfn")
    import_dbfn
    ;;
  "list_dbfn")
    list_dbfn
    ;;
  "drop_dbfn")
    drop_dbfn $@
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
  "import_policies")
    import_policies
    ;;
  "gen_db_types")
    gen_db_types
    ;;
  *)
    supabase $fn $@
    ;;
esac
