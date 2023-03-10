#!/bin/bash

db_host=${DBHOST:-localhost}
db_port=${DBPORT:-54322}
db_user=${DBUSER:-postgres}
db_name=${DBNAME:-postgres}

script_name=$(basename "$0")

# set editor
editor=${EDITOR:-vim}

if command -v code &> /dev/null; then
    export editor=code
fi

if command -v subl &> /dev/null; then
    export EDITOR=subl
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

function drop_dbfn {
    if [ -z "$1" ]
    then
        echo "Usage: drop_dbfn <function_name>"
        return
    fi
    
    # Use psql to drop the function
    psql -h $db_host -p $db_port -U $db_user -d $db_name -c "DROP FUNCTION relay_$1();"

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

function help {
message=$(cat <<-END
    $script_name <command>

    Create a function:
        ./$script_name create_dbfn <function_name>

    Note that these are database functions (not edge functions)

    List functions:
        ./$script_name list_dbfn

    Show functions that have relay_* prefix

    Import functions:
        ./$script_name import_dbfn

    Import all functions found in "./supabase/functions"

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
  *)
    supabase $fn $@
    ;;
esac
