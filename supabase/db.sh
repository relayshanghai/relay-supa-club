#!/bin/bash

# You shouldn't need to change these envrioment variables developing locally.
db_host=${PGHOST:-localhost}
db_port=${PGPORT:-54322}
db_user=${PGUSER:-postgres}
db_name=${PGDATABASE:-postgres}

# get the script's directory
script_dir="$(cd "$( dirname "${BASH_SOURCE[0]}")" && pwd)"

# first parameter
script_name=$0

# set editor
editor=${EDITOR:-vim}

# check if code command exists (so it will default to vscode if you have it available)
# `command` is a unix command to see if a command exists in the path
# `&> /dev/null` is a way to redirect the output to /dev/null (basically, don't show the output) dev/null is a special file that discards all input
# `>` is a way to redirect the output to a file, stdout is the default output
# `&>` also redirects the error output `stderr`
if command -v code &>/dev/null; then
    editor=code
fi

if command -v subl &>/dev/null; then
    editor=subl
fi

# bufio.Scanner fix
export SUPABASE_SCANNER_BUFFER_SIZE=5mb

# Check if psql command exists
function check_psql {
    if ! command -v psql &>/dev/null; then
        echo "psql is not installed. Please install psql and try again."
        # exit one is a unix command to exit the script with an error code
        # to exit with a success code, use exit 0
        exit 1
    fi
}

function drop_database_function {
    # null check. If the first parameter of the function ($1) is null, then exit
    if [ -z "$1" ]
    then
        echo "Usage: drop_dbfn <function_name>"
        exit 1
    fi

    # Use psql to drop the function

    psql --host $db_host --port $db_port --username $db_user --dbname $db_name --command "DROP FUNCTION IF EXISTS relay_$1();"
    sed -i "/\/$1\.sql/d" $script_dir/functions/index.sql
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
    psql -h $db_host -p $db_port -U $db_user -d $db_name $@
}

function create_database_functions {
    fn_name=${1:-hello_world}
    message=$(
        cat <<-TEMPLATE
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
    echo "$message" >"./supabase/functions/$fn_name.sql"                                 # > is a way to redirect the output to a file, stdout is the default output
    echo "\include ./supabase/functions/$fn_name.sql" >>"./supabase/functions/index.sql" # >> is a way to append the output to a file

    if [ -n "$editor" ]; then
        $editor ./supabase/functions/$fn_name.sql
    fi
}

function supabase {
    if ! npx supabase -v >/dev/null; then
        echo "Cannot run 'npx supabase'. Make sure you can use supabase in your cli"
        exit 1
    fi
    # $@ is a way to pass all the parameters to the function to the command
    npx supabase $@
}

function save_password {
    read -s -p "Password: " password
    echo $db_host:$db_port:$db_name:$db_user:$password >>~/.pgpass
    chmod 600 ~/.pgpass
}

function create_test {
    test_name=$1

    if [ -z "$test_name" ]; then
        echo "$script_name create_test <test_name>"
        exit 1
    fi

    message=$(
        cat <<-TEMPLATE
-- Functions directory: /tmp/supabase/functions
-- Policies directory: /tmp/supabase/policies

BEGIN;
SELECT plan(1); -- no. of tests in the file

-- start includes
-- \include /tmp/supabase/functions/function.sql
-- \include /tmp/supabase/policies/foo.policy.sql
-- end includes

SELECT has_column('auth', 'users', 'id', 'id should exist');
-- SELECT has_function('function_name'); -- test function
-- SELECT policy_cmd_is('table', 'policy', 'command'); -- test policy

SELECT * FROM finish(); -- end test
ROLLBACK;
TEMPLATE
    )
    echo "$message" >"./supabase/tests/database/$test_name.test.sql"

    if [ -n "$editor" ]; then
        $editor ./supabase/tests/database/$test_name.test.sql
    fi
}

function create_policy {
    pl_name=$1
    tb_name=$2

    if [ -z "$pl_name" ] || [ -z "$tb_name" ] ; then
        echo "$script_name create_policy <policy_name> <table_name>"
        exit 1
    fi

    message=$(
        cat <<-TEMPLATE
DROP POLICY IF EXISTS $pl_name ON $tb_name;

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
    echo "$message" >"$script_dir/policies/$pl_name.policy.sql"
    echo "\include $script_dir/policies/$pl_name.policy.sql" >>"$script_dir/policies/index.sql"

    if [ -n "$editor" ]; then
        $editor $script_dir/policies/$pl_name.policy.sql
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
    sed -i "/\/$pl_name\.policy\.sql/d" $script_dir/policies/index.sql
}

function push_policies {
    file_path=$script_dir/policies/index.sql

    if [ ! -f "$file_path" ]; then
        echo "Error: File $file_path does not exist"
        exit 1
    fi

    psql -h $db_host -p $db_port -U $db_user -d $db_name -f $file_path
}

function generate_database_types {
    npx supabase gen types typescript --local --schema=public > $script_dir/../types/supabase.ts
}

function get_linked_project {
    if [ -f "$script_dir/.temp/project-ref" ]; then
        project_ref=$(cat $script_dir/.temp/project-ref)

        if [ "$1" == "--verbose" ]; then
            echo " ID: $project_ref"
            echo "URL: https://app.supabase.com/project/$project_ref"
        else
            echo $project_ref
        fi
    else
        echo "No projects linked. Pick one below"
        npx supabase projects list
    fi
}

# Reverse engineered from
# https://github.com/supabase/cli/blob/main/internal/db/test/test.go#L39
function test_database {
    # get the `project_id` in the config.toml
    project_id=$(awk -F '[ "=]+' '$1=="project_id" {print $2}' "$script_dir/config.toml")
    container="supabase_db_$project_id"

    # copy files
    docker cp $script_dir/functions $container:/tmp/supabase/ > /dev/null
    docker cp $script_dir/policies $container:/tmp/supabase/ > /dev/null

    if [ -z "$1" ]; then
        docker cp $script_dir/tests $container:/tmp/supabase/ > /dev/null
    fi


    if [ -n "$1" ]; then
        docker exec $container mkdir -p /tmp/supabase/tests/database/
        docker cp $script_dir/tests/database/00000-supabase_test_helpers.sql $container:/tmp/supabase/tests/database/ > /dev/null
        docker cp $script_dir/tests/database/00001-relay_test_helpers.sql $container:/tmp/supabase/tests/database/ > /dev/null
        docker cp $script_dir/tests/database/00002-seed.test.sql $container:/tmp/supabase/tests/database/ > /dev/null
        docker cp $script_dir/tests/database/zzzzz-cleanup_helpers.sql $container:/tmp/supabase/tests/database/ > /dev/null

        for file in "$@"
        do
            if [ -e "$script_dir/tests/database/$file.test.sql" ]; then
                docker cp $script_dir/tests/database/$file.test.sql $container:/tmp/supabase/tests/database/ > /dev/null
            fi
        done
    fi

    docker cp $script_dir/utils/supa_pg_prove.sh $container:/tmp/supabase/ > /dev/null

    # run tests
    docker exec -t $container bash /tmp/supabase/supa_pg_prove.sh /tmp/supabase/tests

    # remove all copied files
    docker exec $container rm -rf /tmp/supabase/functions
    docker exec $container rm -rf /tmp/supabase/policies
    docker exec $container rm -rf /tmp/supabase/tests
    docker exec $container rm -rf /tmp/supabase/supa_pg_prove.sh
}

function help {
    message=$(
        cat <<-END
    $script_name <command> [params]

    Create a "database" function - Note that these are database functions (not edge functions)
        ./$script_name create_dbfn <function_name>

    Note that these are database functions (not edge functions)
    All functions created with this command will have a relay_* prefix
    This command creates a function in "./supabase/functions" and adds it to "./supabase/functions/index.sql"

    List database functions - Show functions that have relay_* prefix
        ./$script_name list_dbfn

    Push database functions - Pushes ALL functions found in "./supabase/functions"
        ./$script_name push_dbfn
        
    Runs a postgres query to import all functions with relay_* prefix and adds them to the database that is connected based on what environment variables you have set for the DBHOST, DBPORT, DBUSER, DBNAME, and DBPASSWORD.

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
        
    Runs a postgres query to import all functions with relay_* prefix and adds them to the database that is connected based on what environment variables you have set for the DBHOST, DBPORT, DBUSER, DBNAME, and DBPASSWORD.

    Drop a policy:
        ./$script_name drop_policy <policy_name> <table_name>

    Test database:
        ./$script_name db_test [test1] [test2...]

    Display the linked project:
        ./$script_name get_proj [--verbose]
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
  "db_test")
    test_database $@
    ;;
  "get_proj")
    get_linked_project $@
    ;;
*)
    supabase $fn $@
    ;;
esac
