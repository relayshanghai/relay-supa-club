--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";


--
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA "public" OWNER TO "postgres";

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";


--
-- Name: pgtap; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgtap" WITH SCHEMA "extensions";


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";


--
-- Name: _time_trial_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."_time_trial_type" AS (
	"a_time" numeric
);


ALTER TYPE "public"."_time_trial_type" OWNER TO "postgres";

--
-- Name: _add("text", integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_add"("text", integer) RETURNS integer
    LANGUAGE "sql"
    AS $_$
    SELECT _add($1, $2, '')
$_$;


ALTER FUNCTION "public"."_add"("text", integer) OWNER TO "postgres";

--
-- Name: _add("text", integer, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_add"("text", integer, "text") RETURNS integer
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    EXECUTE 'INSERT INTO __tcache__ (label, value, note) values (' ||
    quote_literal($1) || ', ' || $2 || ', ' || quote_literal(COALESCE($3, '')) || ')';
    RETURN $2;
END;
$_$;


ALTER FUNCTION "public"."_add"("text", integer, "text") OWNER TO "postgres";

--
-- Name: _alike(boolean, "anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_alike"(boolean, "anyelement", "text", "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    result ALIAS FOR $1;
    got    ALIAS FOR $2;
    rx     ALIAS FOR $3;
    descr  ALIAS FOR $4;
    output TEXT;
BEGIN
    output := ok( result, descr );
    RETURN output || CASE result WHEN TRUE THEN '' ELSE E'\n' || diag(
           '                  ' || COALESCE( quote_literal(got), 'NULL' ) ||
       E'\n   doesn''t match: ' || COALESCE( quote_literal(rx), 'NULL' )
    ) END;
END;
$_$;


ALTER FUNCTION "public"."_alike"(boolean, "anyelement", "text", "text") OWNER TO "postgres";

--
-- Name: _error_diag("text", "text", "text", "text", "text", "text", "text", "text", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_error_diag"("text", "text", "text", "text", "text", "text", "text", "text", "text", "text") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    AS $_$
    SELECT COALESCE(
               COALESCE( NULLIF($1, '') || ': ', '' ) || COALESCE( NULLIF($2, ''), '' ),
               'NO ERROR FOUND'
           )
        || COALESCE(E'\n        DETAIL:     ' || nullif($3, ''), '')
        || COALESCE(E'\n        HINT:       ' || nullif($4, ''), '')
        || COALESCE(E'\n        SCHEMA:     ' || nullif($6, ''), '')
        || COALESCE(E'\n        TABLE:      ' || nullif($7, ''), '')
        || COALESCE(E'\n        COLUMN:     ' || nullif($8, ''), '')
        || COALESCE(E'\n        CONSTRAINT: ' || nullif($9, ''), '')
        || COALESCE(E'\n        TYPE:       ' || nullif($10, ''), '')
        -- We need to manually indent all the context lines
        || COALESCE(E'\n        CONTEXT:\n'
               || regexp_replace(NULLIF( $5, ''), '^', '            ', 'gn'
           ), '');
$_$;


ALTER FUNCTION "public"."_error_diag"("text", "text", "text", "text", "text", "text", "text", "text", "text", "text") OWNER TO "postgres";

--
-- Name: _finish(integer, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_finish"(integer, integer, integer) RETURNS SETOF "text"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    curr_test ALIAS FOR $1;
    exp_tests INTEGER := $2;
    num_faild ALIAS FOR $3;
    plural    CHAR;
BEGIN
    plural    := CASE exp_tests WHEN 1 THEN '' ELSE 's' END;

    IF curr_test IS NULL THEN
        RAISE EXCEPTION '# No tests run!';
    END IF;

    IF exp_tests = 0 OR exp_tests IS NULL THEN
         -- No plan. Output one now.
        exp_tests = curr_test;
        RETURN NEXT '1..' || exp_tests;
    END IF;

    IF curr_test <> exp_tests THEN
        RETURN NEXT diag(
            'Looks like you planned ' || exp_tests || ' test' ||
            plural || ' but ran ' || curr_test
        );
    ELSIF num_faild > 0 THEN
        RETURN NEXT diag(
            'Looks like you failed ' || num_faild || ' test' ||
            CASE num_faild WHEN 1 THEN '' ELSE 's' END
            || ' of ' || exp_tests
        );
    ELSE

    END IF;
    RETURN;
END;
$_$;


ALTER FUNCTION "public"."_finish"(integer, integer, integer) OWNER TO "postgres";

--
-- Name: _get("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_get"("text") RETURNS integer
    LANGUAGE "plpgsql" STRICT
    AS $_$
DECLARE
    ret integer;
BEGIN
    EXECUTE 'SELECT value FROM __tcache__ WHERE label = ' || quote_literal($1) || ' LIMIT 1' INTO ret;
    RETURN ret;
END;
$_$;


ALTER FUNCTION "public"."_get"("text") OWNER TO "postgres";

--
-- Name: _get_latest("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_get_latest"("text") RETURNS integer[]
    LANGUAGE "plpgsql" STRICT
    AS $_$
DECLARE
    ret integer[];
BEGIN
    EXECUTE 'SELECT ARRAY[id, value] FROM __tcache__ WHERE label = ' ||
    quote_literal($1) || ' AND id = (SELECT MAX(id) FROM __tcache__ WHERE label = ' ||
    quote_literal($1) || ') LIMIT 1' INTO ret;
    RETURN ret;
EXCEPTION WHEN undefined_table THEN
   RAISE EXCEPTION 'You tried to run a test without a plan! Gotta have a plan';
END;
$_$;


ALTER FUNCTION "public"."_get_latest"("text") OWNER TO "postgres";

--
-- Name: _get_latest("text", integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_get_latest"("text", integer) RETURNS integer
    LANGUAGE "plpgsql" STRICT
    AS $_$
DECLARE
    ret integer;
BEGIN
    EXECUTE 'SELECT MAX(id) FROM __tcache__ WHERE label = ' ||
    quote_literal($1) || ' AND value = ' || $2 INTO ret;
    RETURN ret;
END;
$_$;


ALTER FUNCTION "public"."_get_latest"("text", integer) OWNER TO "postgres";

--
-- Name: _get_note(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_get_note"(integer) RETURNS "text"
    LANGUAGE "plpgsql" STRICT
    AS $_$
DECLARE
    ret text;
BEGIN
    EXECUTE 'SELECT note FROM __tcache__ WHERE id = ' || $1 || ' LIMIT 1' INTO ret;
    RETURN ret;
END;
$_$;


ALTER FUNCTION "public"."_get_note"(integer) OWNER TO "postgres";

--
-- Name: _get_note("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_get_note"("text") RETURNS "text"
    LANGUAGE "plpgsql" STRICT
    AS $_$
DECLARE
    ret text;
BEGIN
    EXECUTE 'SELECT note FROM __tcache__ WHERE label = ' || quote_literal($1) || ' LIMIT 1' INTO ret;
    RETURN ret;
END;
$_$;


ALTER FUNCTION "public"."_get_note"("text") OWNER TO "postgres";

--
-- Name: _query("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_query"("text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT CASE
        WHEN $1 LIKE '"%' OR $1 !~ '[[:space:]]' THEN 'EXECUTE ' || $1
        ELSE $1
    END;
$_$;


ALTER FUNCTION "public"."_query"("text") OWNER TO "postgres";

--
-- Name: _relexists("name"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_relexists"("name") RETURNS boolean
    LANGUAGE "sql"
    AS $_$
    SELECT EXISTS(
        SELECT true
          FROM pg_catalog.pg_class c
         WHERE pg_catalog.pg_table_is_visible(c.oid)
           AND c.relname = $1
    );
$_$;


ALTER FUNCTION "public"."_relexists"("name") OWNER TO "postgres";

--
-- Name: _relexists("name", "name"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_relexists"("name", "name") RETURNS boolean
    LANGUAGE "sql"
    AS $_$
    SELECT EXISTS(
        SELECT true
          FROM pg_catalog.pg_namespace n
          JOIN pg_catalog.pg_class c ON n.oid = c.relnamespace
         WHERE n.nspname = $1
           AND c.relname = $2
    );
$_$;


ALTER FUNCTION "public"."_relexists"("name", "name") OWNER TO "postgres";

--
-- Name: _rexists(character[], "name"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_rexists"(character[], "name") RETURNS boolean
    LANGUAGE "sql"
    AS $_$
    SELECT EXISTS(
        SELECT true
          FROM pg_catalog.pg_class c
         WHERE c.relkind = ANY($1)
           AND pg_catalog.pg_table_is_visible(c.oid)
           AND c.relname = $2
    );
$_$;


ALTER FUNCTION "public"."_rexists"(character[], "name") OWNER TO "postgres";

--
-- Name: _rexists(character, "name"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_rexists"(character, "name") RETURNS boolean
    LANGUAGE "sql"
    AS $_$
SELECT _rexists(ARRAY[$1], $2);
$_$;


ALTER FUNCTION "public"."_rexists"(character, "name") OWNER TO "postgres";

--
-- Name: _rexists(character[], "name", "name"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_rexists"(character[], "name", "name") RETURNS boolean
    LANGUAGE "sql"
    AS $_$
    SELECT EXISTS(
        SELECT true
          FROM pg_catalog.pg_namespace n
          JOIN pg_catalog.pg_class c ON n.oid = c.relnamespace
         WHERE c.relkind = ANY($1)
           AND n.nspname = $2
           AND c.relname = $3
    );
$_$;


ALTER FUNCTION "public"."_rexists"(character[], "name", "name") OWNER TO "postgres";

--
-- Name: _rexists(character, "name", "name"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_rexists"(character, "name", "name") RETURNS boolean
    LANGUAGE "sql"
    AS $_$
    SELECT _rexists(ARRAY[$1], $2, $3);
$_$;


ALTER FUNCTION "public"."_rexists"(character, "name", "name") OWNER TO "postgres";

--
-- Name: _set(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_set"(integer, integer) RETURNS integer
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    EXECUTE 'UPDATE __tcache__ SET value = ' || $2
        || ' WHERE id = ' || $1;
    RETURN $2;
END;
$_$;


ALTER FUNCTION "public"."_set"(integer, integer) OWNER TO "postgres";

--
-- Name: _set("text", integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_set"("text", integer) RETURNS integer
    LANGUAGE "sql"
    AS $_$
    SELECT _set($1, $2, '')
$_$;


ALTER FUNCTION "public"."_set"("text", integer) OWNER TO "postgres";

--
-- Name: _set("text", integer, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_set"("text", integer, "text") RETURNS integer
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    rcount integer;
BEGIN
    EXECUTE 'UPDATE __tcache__ SET value = ' || $2
        || CASE WHEN $3 IS NULL THEN '' ELSE ', note = ' || quote_literal($3) END
        || ' WHERE label = ' || quote_literal($1);
    GET DIAGNOSTICS rcount = ROW_COUNT;
    IF rcount = 0 THEN
       RETURN _add( $1, $2, $3 );
    END IF;
    RETURN $2;
END;
$_$;


ALTER FUNCTION "public"."_set"("text", integer, "text") OWNER TO "postgres";

--
-- Name: _time_trials("text", integer, numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_time_trials"("text", integer, numeric) RETURNS SETOF "public"."_time_trial_type"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    query            TEXT := _query($1);
    iterations       ALIAS FOR $2;
    return_percent   ALIAS FOR $3;
    start_time       TEXT;
    act_time         NUMERIC;
    times            NUMERIC[];
    offset_it        INT;
    limit_it         INT;
    offset_percent   NUMERIC;
    a_time	     _time_trial_type;
BEGIN
    -- Execute the query over and over
    FOR i IN 1..iterations LOOP
        start_time := timeofday();
        EXECUTE query;
        -- Store the execution time for the run in an array of times
        times[i] := extract(millisecond from timeofday()::timestamptz - start_time::timestamptz);
    END LOOP;
    offset_percent := (1.0 - return_percent) / 2.0;
    -- Ensure that offset skips the bottom X% of runs, or set it to 0
    SELECT GREATEST((offset_percent * iterations)::int, 0) INTO offset_it;
    -- Ensure that with limit the query to returning only the middle X% of runs
    SELECT GREATEST((return_percent * iterations)::int, 1) INTO limit_it;

    FOR a_time IN SELECT times[i]
		  FROM generate_series(array_lower(times, 1), array_upper(times, 1)) i
                  ORDER BY 1
                  OFFSET offset_it
                  LIMIT limit_it LOOP
	RETURN NEXT a_time;
    END LOOP;
END;
$_$;


ALTER FUNCTION "public"."_time_trials"("text", integer, numeric) OWNER TO "postgres";

--
-- Name: _todo(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_todo"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    todos INT[];
    note text;
BEGIN
    -- Get the latest id and value, because todo() might have been called
    -- again before the todos ran out for the first call to todo(). This
    -- allows them to nest.
    todos := _get_latest('todo');
    IF todos IS NULL THEN
        -- No todos.
        RETURN NULL;
    END IF;
    IF todos[2] = 0 THEN
        -- Todos depleted. Clean up.
        EXECUTE 'DELETE FROM __tcache__ WHERE id = ' || todos[1];
        RETURN NULL;
    END IF;
    -- Decrement the count of counted todos and return the reason.
    IF todos[2] <> -1 THEN
        PERFORM _set(todos[1], todos[2] - 1);
    END IF;
    note := _get_note(todos[1]);

    IF todos[2] = 1 THEN
        -- This was the last todo, so delete the record.
        EXECUTE 'DELETE FROM __tcache__ WHERE id = ' || todos[1];
    END IF;

    RETURN note;
END;
$$;


ALTER FUNCTION "public"."_todo"() OWNER TO "postgres";

--
-- Name: _unalike(boolean, "anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."_unalike"(boolean, "anyelement", "text", "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    result ALIAS FOR $1;
    got    ALIAS FOR $2;
    rx     ALIAS FOR $3;
    descr  ALIAS FOR $4;
    output TEXT;
BEGIN
    output := ok( result, descr );
    RETURN output || CASE result WHEN TRUE THEN '' ELSE E'\n' || diag(
           '                  ' || COALESCE( quote_literal(got), 'NULL' ) ||
        E'\n         matches: ' || COALESCE( quote_literal(rx), 'NULL' )
    ) END;
END;
$_$;


ALTER FUNCTION "public"."_unalike"(boolean, "anyelement", "text", "text") OWNER TO "postgres";

--
-- Name: add_result(boolean, boolean, "text", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."add_result"(boolean, boolean, "text", "text", "text") RETURNS integer
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    IF NOT $1 THEN PERFORM _set('failed', _get('failed') + 1); END IF;
    RETURN nextval('__tresults___numb_seq');
END;
$_$;


ALTER FUNCTION "public"."add_result"(boolean, boolean, "text", "text", "text") OWNER TO "postgres";

--
-- Name: alike("anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."alike"("anyelement", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT _alike( $1 ~~ $2, $1, $2, NULL );
$_$;


ALTER FUNCTION "public"."alike"("anyelement", "text") OWNER TO "postgres";

--
-- Name: alike("anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."alike"("anyelement", "text", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT _alike( $1 ~~ $2, $1, $2, $3 );
$_$;


ALTER FUNCTION "public"."alike"("anyelement", "text", "text") OWNER TO "postgres";

--
-- Name: cmp_ok("anyelement", "text", "anyelement"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."cmp_ok"("anyelement", "text", "anyelement") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT cmp_ok( $1, $2, $3, NULL );
$_$;


ALTER FUNCTION "public"."cmp_ok"("anyelement", "text", "anyelement") OWNER TO "postgres";

--
-- Name: cmp_ok("anyelement", "text", "anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."cmp_ok"("anyelement", "text", "anyelement", "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    have   ALIAS FOR $1;
    op     ALIAS FOR $2;
    want   ALIAS FOR $3;
    descr  ALIAS FOR $4;
    result BOOLEAN;
    output TEXT;
BEGIN
    EXECUTE 'SELECT ' ||
            COALESCE(quote_literal( have ), 'NULL') || '::' || pg_typeof(have) || ' '
            || op || ' ' ||
            COALESCE(quote_literal( want ), 'NULL') || '::' || pg_typeof(want)
       INTO result;
    output := ok( COALESCE(result, FALSE), descr );
    RETURN output || CASE result WHEN TRUE THEN '' ELSE E'\n' || diag(
           '    ' || COALESCE( quote_literal(have), 'NULL' ) ||
           E'\n        ' || op ||
           E'\n    ' || COALESCE( quote_literal(want), 'NULL' )
    ) END;
END;
$_$;


ALTER FUNCTION "public"."cmp_ok"("anyelement", "text", "anyelement", "text") OWNER TO "postgres";

--
-- Name: diag("text"[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."diag"(VARIADIC "text"[]) RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT diag(array_to_string($1, ''));
$_$;


ALTER FUNCTION "public"."diag"(VARIADIC "text"[]) OWNER TO "postgres";

--
-- Name: diag("anyarray"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."diag"(VARIADIC "anyarray") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT diag(array_to_string($1, ''));
$_$;


ALTER FUNCTION "public"."diag"(VARIADIC "anyarray") OWNER TO "postgres";

--
-- Name: diag("anyelement"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."diag"("msg" "anyelement") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT diag($1::text);
$_$;


ALTER FUNCTION "public"."diag"("msg" "anyelement") OWNER TO "postgres";

--
-- Name: diag("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."diag"("msg" "text") RETURNS "text"
    LANGUAGE "sql" STRICT
    AS $_$
    SELECT '# ' || replace(
       replace(
            replace( $1, E'\r\n', E'\n# ' ),
            E'\n',
            E'\n# '
        ),
        E'\r',
        E'\n# '
    );
$_$;


ALTER FUNCTION "public"."diag"("msg" "text") OWNER TO "postgres";

--
-- Name: doesnt_imatch("anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."doesnt_imatch"("anyelement", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT _unalike( $1 !~* $2, $1, $2, NULL );
$_$;


ALTER FUNCTION "public"."doesnt_imatch"("anyelement", "text") OWNER TO "postgres";

--
-- Name: doesnt_imatch("anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."doesnt_imatch"("anyelement", "text", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT _unalike( $1 !~* $2, $1, $2, $3 );
$_$;


ALTER FUNCTION "public"."doesnt_imatch"("anyelement", "text", "text") OWNER TO "postgres";

--
-- Name: doesnt_match("anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."doesnt_match"("anyelement", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT _unalike( $1 !~ $2, $1, $2, NULL );
$_$;


ALTER FUNCTION "public"."doesnt_match"("anyelement", "text") OWNER TO "postgres";

--
-- Name: doesnt_match("anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."doesnt_match"("anyelement", "text", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT _unalike( $1 !~ $2, $1, $2, $3 );
$_$;


ALTER FUNCTION "public"."doesnt_match"("anyelement", "text", "text") OWNER TO "postgres";

--
-- Name: fail(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."fail"() RETURNS "text"
    LANGUAGE "sql"
    AS $$
    SELECT ok( FALSE, NULL );
$$;


ALTER FUNCTION "public"."fail"() OWNER TO "postgres";

--
-- Name: fail("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."fail"("text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT ok( FALSE, $1 );
$_$;


ALTER FUNCTION "public"."fail"("text") OWNER TO "postgres";

--
-- Name: finish(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."finish"() RETURNS SETOF "text"
    LANGUAGE "sql"
    AS $$
    SELECT * FROM _finish(
        _get('curr_test'),
        _get('plan'),
        num_failed()
    );
$$;


ALTER FUNCTION "public"."finish"() OWNER TO "postgres";

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (id, first_name, last_name, company_id, email)
  values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', cast(new.raw_user_meta_data ->> 'company_id' as uuid), new.email);
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

--
-- Name: has_relation("name"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."has_relation"("name") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT has_relation( $1, 'Relation ' || quote_ident($1) || ' should exist' );
$_$;


ALTER FUNCTION "public"."has_relation"("name") OWNER TO "postgres";

--
-- Name: has_relation("name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."has_relation"("name", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT ok( _relexists( $1 ), $2 );
$_$;


ALTER FUNCTION "public"."has_relation"("name", "text") OWNER TO "postgres";

--
-- Name: has_relation("name", "name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."has_relation"("name", "name", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT ok( _relexists( $1, $2 ), $3 );
$_$;


ALTER FUNCTION "public"."has_relation"("name", "name", "text") OWNER TO "postgres";

--
-- Name: has_table("name"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."has_table"("name") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT has_table( $1, 'Table ' || quote_ident($1) || ' should exist' );
$_$;


ALTER FUNCTION "public"."has_table"("name") OWNER TO "postgres";

--
-- Name: has_table("name", "name"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."has_table"("name", "name") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT ok(
        _rexists( '{r,p}'::char[], $1, $2 ),
        'Table ' || quote_ident($1) || '.' || quote_ident($2) || ' should exist'
    );
$_$;


ALTER FUNCTION "public"."has_table"("name", "name") OWNER TO "postgres";

--
-- Name: has_table("name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."has_table"("name", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT ok( _rexists( '{r,p}'::char[], $1 ), $2 );
$_$;


ALTER FUNCTION "public"."has_table"("name", "text") OWNER TO "postgres";

--
-- Name: has_table("name", "name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."has_table"("name", "name", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT ok( _rexists( '{r,p}'::char[], $1, $2 ), $3 );
$_$;


ALTER FUNCTION "public"."has_table"("name", "name", "text") OWNER TO "postgres";

--
-- Name: has_view("name"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."has_view"("name") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT has_view( $1, 'View ' || quote_ident($1) || ' should exist' );
$_$;


ALTER FUNCTION "public"."has_view"("name") OWNER TO "postgres";

--
-- Name: has_view("name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."has_view"("name", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT ok( _rexists( 'v', $1 ), $2 );
$_$;


ALTER FUNCTION "public"."has_view"("name", "text") OWNER TO "postgres";

--
-- Name: has_view("name", "name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."has_view"("name", "name", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT ok( _rexists( 'v', $1, $2 ), $3 );
$_$;


ALTER FUNCTION "public"."has_view"("name", "name", "text") OWNER TO "postgres";

--
-- Name: hasnt_relation("name"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."hasnt_relation"("name") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT hasnt_relation( $1, 'Relation ' || quote_ident($1) || ' should not exist' );
$_$;


ALTER FUNCTION "public"."hasnt_relation"("name") OWNER TO "postgres";

--
-- Name: hasnt_relation("name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."hasnt_relation"("name", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT ok( NOT _relexists( $1 ), $2 );
$_$;


ALTER FUNCTION "public"."hasnt_relation"("name", "text") OWNER TO "postgres";

--
-- Name: hasnt_relation("name", "name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."hasnt_relation"("name", "name", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT ok( NOT _relexists( $1, $2 ), $3 );
$_$;


ALTER FUNCTION "public"."hasnt_relation"("name", "name", "text") OWNER TO "postgres";

--
-- Name: hasnt_table("name"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."hasnt_table"("name") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT hasnt_table( $1, 'Table ' || quote_ident($1) || ' should not exist' );
$_$;


ALTER FUNCTION "public"."hasnt_table"("name") OWNER TO "postgres";

--
-- Name: hasnt_table("name", "name"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."hasnt_table"("name", "name") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT ok(
        NOT _rexists( '{r,p}'::char[], $1, $2 ),
        'Table ' || quote_ident($1) || '.' || quote_ident($2) || ' should not exist'
    );
$_$;


ALTER FUNCTION "public"."hasnt_table"("name", "name") OWNER TO "postgres";

--
-- Name: hasnt_table("name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."hasnt_table"("name", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT ok( NOT _rexists( '{r,p}'::char[], $1 ), $2 );
$_$;


ALTER FUNCTION "public"."hasnt_table"("name", "text") OWNER TO "postgres";

--
-- Name: hasnt_table("name", "name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."hasnt_table"("name", "name", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT ok( NOT _rexists( '{r,p}'::char[], $1, $2 ), $3 );
$_$;


ALTER FUNCTION "public"."hasnt_table"("name", "name", "text") OWNER TO "postgres";

--
-- Name: hasnt_view("name"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."hasnt_view"("name") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT hasnt_view( $1, 'View ' || quote_ident($1) || ' should not exist' );
$_$;


ALTER FUNCTION "public"."hasnt_view"("name") OWNER TO "postgres";

--
-- Name: hasnt_view("name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."hasnt_view"("name", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT ok( NOT _rexists( 'v', $1 ), $2 );
$_$;


ALTER FUNCTION "public"."hasnt_view"("name", "text") OWNER TO "postgres";

--
-- Name: hasnt_view("name", "name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."hasnt_view"("name", "name", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT ok( NOT _rexists( 'v', $1, $2 ), $3 );
$_$;


ALTER FUNCTION "public"."hasnt_view"("name", "name", "text") OWNER TO "postgres";

--
-- Name: ialike("anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."ialike"("anyelement", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT _alike( $1 ~~* $2, $1, $2, NULL );
$_$;


ALTER FUNCTION "public"."ialike"("anyelement", "text") OWNER TO "postgres";

--
-- Name: ialike("anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."ialike"("anyelement", "text", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT _alike( $1 ~~* $2, $1, $2, $3 );
$_$;


ALTER FUNCTION "public"."ialike"("anyelement", "text", "text") OWNER TO "postgres";

--
-- Name: imatches("anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."imatches"("anyelement", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT _alike( $1 ~* $2, $1, $2, NULL );
$_$;


ALTER FUNCTION "public"."imatches"("anyelement", "text") OWNER TO "postgres";

--
-- Name: imatches("anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."imatches"("anyelement", "text", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT _alike( $1 ~* $2, $1, $2, $3 );
$_$;


ALTER FUNCTION "public"."imatches"("anyelement", "text", "text") OWNER TO "postgres";

--
-- Name: in_todo(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."in_todo"() RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    todos integer;
BEGIN
    todos := _get('todo');
    RETURN CASE WHEN todos IS NULL THEN FALSE ELSE TRUE END;
END;
$$;


ALTER FUNCTION "public"."in_todo"() OWNER TO "postgres";

--
-- Name: is("anyelement", "anyelement"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."is"("anyelement", "anyelement") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT is( $1, $2, NULL);
$_$;


ALTER FUNCTION "public"."is"("anyelement", "anyelement") OWNER TO "postgres";

--
-- Name: is("anyelement", "anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."is"("anyelement", "anyelement", "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    result BOOLEAN;
    output TEXT;
BEGIN
    -- Would prefer $1 IS NOT DISTINCT FROM, but that's not supported by 8.1.
    result := NOT $1 IS DISTINCT FROM $2;
    output := ok( result, $3 );
    RETURN output || CASE result WHEN TRUE THEN '' ELSE E'\n' || diag(
           '        have: ' || CASE WHEN $1 IS NULL THEN 'NULL' ELSE $1::text END ||
        E'\n        want: ' || CASE WHEN $2 IS NULL THEN 'NULL' ELSE $2::text END
    ) END;
END;
$_$;


ALTER FUNCTION "public"."is"("anyelement", "anyelement", "text") OWNER TO "postgres";

--
-- Name: isnt("anyelement", "anyelement"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."isnt"("anyelement", "anyelement") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT isnt( $1, $2, NULL);
$_$;


ALTER FUNCTION "public"."isnt"("anyelement", "anyelement") OWNER TO "postgres";

--
-- Name: isnt("anyelement", "anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."isnt"("anyelement", "anyelement", "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    result BOOLEAN;
    output TEXT;
BEGIN
    result := $1 IS DISTINCT FROM $2;
    output := ok( result, $3 );
    RETURN output || CASE result WHEN TRUE THEN '' ELSE E'\n' || diag(
           '        have: ' || COALESCE( $1::text, 'NULL' ) ||
        E'\n        want: anything else'
    ) END;
END;
$_$;


ALTER FUNCTION "public"."isnt"("anyelement", "anyelement", "text") OWNER TO "postgres";

--
-- Name: lives_ok("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."lives_ok"("text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT lives_ok( $1, NULL );
$_$;


ALTER FUNCTION "public"."lives_ok"("text") OWNER TO "postgres";

--
-- Name: lives_ok("text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."lives_ok"("text", "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    code  TEXT := _query($1);
    descr ALIAS FOR $2;
    detail  text;
    hint    text;
    context text;
    schname text;
    tabname text;
    colname text;
    chkname text;
    typname text;
BEGIN
    EXECUTE code;
    RETURN ok( TRUE, descr );
EXCEPTION WHEN OTHERS OR ASSERT_FAILURE THEN
    -- There should have been no exception.
    GET STACKED DIAGNOSTICS
        detail  = PG_EXCEPTION_DETAIL,
        hint    = PG_EXCEPTION_HINT,
        context = PG_EXCEPTION_CONTEXT,
        schname = SCHEMA_NAME,
        tabname = TABLE_NAME,
        colname = COLUMN_NAME,
        chkname = CONSTRAINT_NAME,
        typname = PG_DATATYPE_NAME;
    RETURN ok( FALSE, descr ) || E'\n' || diag(
           '    died: ' || _error_diag(SQLSTATE, SQLERRM, detail, hint, context, schname, tabname, colname, chkname, typname)
    );
END;
$_$;


ALTER FUNCTION "public"."lives_ok"("text", "text") OWNER TO "postgres";

--
-- Name: matches("anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."matches"("anyelement", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT _alike( $1 ~ $2, $1, $2, NULL );
$_$;


ALTER FUNCTION "public"."matches"("anyelement", "text") OWNER TO "postgres";

--
-- Name: matches("anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."matches"("anyelement", "text", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT _alike( $1 ~ $2, $1, $2, $3 );
$_$;


ALTER FUNCTION "public"."matches"("anyelement", "text", "text") OWNER TO "postgres";

--
-- Name: no_plan(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."no_plan"() RETURNS SETOF boolean
    LANGUAGE "plpgsql" STRICT
    AS $$
BEGIN
    PERFORM plan(0);
    RETURN;
END;
$$;


ALTER FUNCTION "public"."no_plan"() OWNER TO "postgres";

--
-- Name: num_failed(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."num_failed"() RETURNS integer
    LANGUAGE "sql" STRICT
    AS $$
    SELECT _get('failed');
$$;


ALTER FUNCTION "public"."num_failed"() OWNER TO "postgres";

--
-- Name: ok(boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."ok"(boolean) RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT ok( $1, NULL );
$_$;


ALTER FUNCTION "public"."ok"(boolean) OWNER TO "postgres";

--
-- Name: ok(boolean, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."ok"(boolean, "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
   aok      ALIAS FOR $1;
   descr    text := $2;
   test_num INTEGER;
   todo_why TEXT;
   ok       BOOL;
BEGIN
   todo_why := _todo();
   ok       := CASE
       WHEN aok = TRUE THEN aok
       WHEN todo_why IS NULL THEN COALESCE(aok, false)
       ELSE TRUE
    END;
    IF _get('plan') IS NULL THEN
        RAISE EXCEPTION 'You tried to run a test without a plan! Gotta have a plan';
    END IF;

    test_num := add_result(
        ok,
        COALESCE(aok, false),
        descr,
        CASE WHEN todo_why IS NULL THEN '' ELSE 'todo' END,
        COALESCE(todo_why, '')
    );

    RETURN (CASE aok WHEN TRUE THEN '' ELSE 'not ' END)
           || 'ok ' || _set( 'curr_test', test_num )
           || CASE descr WHEN '' THEN '' ELSE COALESCE( ' - ' || substr(diag( descr ), 3), '' ) END
           || COALESCE( ' ' || diag( 'TODO ' || todo_why ), '')
           || CASE aok WHEN TRUE THEN '' ELSE E'\n' ||
                diag('Failed ' ||
                CASE WHEN todo_why IS NULL THEN '' ELSE '(TODO) ' END ||
                'test ' || test_num ||
                CASE descr WHEN '' THEN '' ELSE COALESCE(': "' || descr || '"', '') END ) ||
                CASE WHEN aok IS NULL THEN E'\n' || diag('    (test result was NULL)') ELSE '' END
           END;
END;
$_$;


ALTER FUNCTION "public"."ok"(boolean, "text") OWNER TO "postgres";

--
-- Name: os_name(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."os_name"() RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    AS $$SELECT 'linux'::text;$$;


ALTER FUNCTION "public"."os_name"() OWNER TO "postgres";

--
-- Name: pass(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."pass"() RETURNS "text"
    LANGUAGE "sql"
    AS $$
    SELECT ok( TRUE, NULL );
$$;


ALTER FUNCTION "public"."pass"() OWNER TO "postgres";

--
-- Name: pass("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."pass"("text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT ok( TRUE, $1 );
$_$;


ALTER FUNCTION "public"."pass"("text") OWNER TO "postgres";

--
-- Name: performs_ok("text", numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."performs_ok"("text", numeric) RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT performs_ok(
        $1, $2, 'Should run in less than ' || $2 || ' ms'
    );
$_$;


ALTER FUNCTION "public"."performs_ok"("text", numeric) OWNER TO "postgres";

--
-- Name: performs_ok("text", numeric, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."performs_ok"("text", numeric, "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    query     TEXT := _query($1);
    max_time  ALIAS FOR $2;
    descr     ALIAS FOR $3;
    starts_at TEXT;
    act_time  NUMERIC;
BEGIN
    starts_at := timeofday();
    EXECUTE query;
    act_time := extract( millisecond from timeofday()::timestamptz - starts_at::timestamptz);
    IF act_time < max_time THEN RETURN ok(TRUE, descr); END IF;
    RETURN ok( FALSE, descr ) || E'\n' || diag(
           '      runtime: ' || act_time || ' ms' ||
        E'\n      exceeds: ' || max_time || ' ms'
    );
END;
$_$;


ALTER FUNCTION "public"."performs_ok"("text", numeric, "text") OWNER TO "postgres";

--
-- Name: performs_within("text", numeric, numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."performs_within"("text", numeric, numeric) RETURNS "text"
    LANGUAGE "sql"
    AS $_$
SELECT performs_within(
          $1, $2, $3, 10,
          'Should run within ' || $2 || ' +/- ' || $3 || ' ms');
$_$;


ALTER FUNCTION "public"."performs_within"("text", numeric, numeric) OWNER TO "postgres";

--
-- Name: performs_within("text", numeric, numeric, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."performs_within"("text", numeric, numeric, integer) RETURNS "text"
    LANGUAGE "sql"
    AS $_$
SELECT performs_within(
          $1, $2, $3, $4,
          'Should run within ' || $2 || ' +/- ' || $3 || ' ms');
$_$;


ALTER FUNCTION "public"."performs_within"("text", numeric, numeric, integer) OWNER TO "postgres";

--
-- Name: performs_within("text", numeric, numeric, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."performs_within"("text", numeric, numeric, "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
SELECT performs_within(
          $1, $2, $3, 10, $4
        );
$_$;


ALTER FUNCTION "public"."performs_within"("text", numeric, numeric, "text") OWNER TO "postgres";

--
-- Name: performs_within("text", numeric, numeric, integer, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."performs_within"("text", numeric, numeric, integer, "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    query          TEXT := _query($1);
    expected_avg   ALIAS FOR $2;
    within         ALIAS FOR $3;
    iterations     ALIAS FOR $4;
    descr          ALIAS FOR $5;
    avg_time       NUMERIC;
BEGIN
  SELECT avg(a_time) FROM _time_trials(query, iterations, 0.8) t1 INTO avg_time;
  IF abs(avg_time - expected_avg) < within THEN RETURN ok(TRUE, descr); END IF;
  RETURN ok(FALSE, descr) || E'\n' || diag(' average runtime: ' || avg_time || ' ms'
     || E'\n desired average: ' || expected_avg || ' +/- ' || within || ' ms'
    );
END;
$_$;


ALTER FUNCTION "public"."performs_within"("text", numeric, numeric, integer, "text") OWNER TO "postgres";

--
-- Name: pg_version(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."pg_version"() RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    AS $$SELECT current_setting('server_version')$$;


ALTER FUNCTION "public"."pg_version"() OWNER TO "postgres";

--
-- Name: pg_version_num(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."pg_version_num"() RETURNS integer
    LANGUAGE "sql" IMMUTABLE
    AS $$
    SELECT current_setting('server_version_num')::integer;
$$;


ALTER FUNCTION "public"."pg_version_num"() OWNER TO "postgres";

--
-- Name: pgtap_version(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."pgtap_version"() RETURNS numeric
    LANGUAGE "sql" IMMUTABLE
    AS $$SELECT 1.0;$$;


ALTER FUNCTION "public"."pgtap_version"() OWNER TO "postgres";

--
-- Name: plan(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."plan"(integer) RETURNS "text"
    LANGUAGE "plpgsql" STRICT
    AS $_$
DECLARE
    rcount INTEGER;
BEGIN
    BEGIN
        EXECUTE '
            CREATE TEMP SEQUENCE __tcache___id_seq;
            CREATE TEMP TABLE __tcache__ (
                id    INTEGER NOT NULL DEFAULT nextval(''__tcache___id_seq''),
                label TEXT    NOT NULL,
                value INTEGER NOT NULL,
                note  TEXT    NOT NULL DEFAULT ''''
            );
            CREATE UNIQUE INDEX __tcache___key ON __tcache__(id);
            GRANT ALL ON TABLE __tcache__ TO PUBLIC;
            GRANT ALL ON TABLE __tcache___id_seq TO PUBLIC;

            CREATE TEMP SEQUENCE __tresults___numb_seq;
            GRANT ALL ON TABLE __tresults___numb_seq TO PUBLIC;
        ';

    EXCEPTION WHEN duplicate_table THEN
        -- Raise an exception if there's already a plan.
        EXECUTE 'SELECT TRUE FROM __tcache__ WHERE label = ''plan''';
      GET DIAGNOSTICS rcount = ROW_COUNT;
        IF rcount > 0 THEN
           RAISE EXCEPTION 'You tried to plan twice!';
        END IF;
    END;

    -- Save the plan and return.
    PERFORM _set('plan', $1 );
    PERFORM _set('failed', 0 );
    RETURN '1..' || $1;
END;
$_$;


ALTER FUNCTION "public"."plan"(integer) OWNER TO "postgres";

--
-- Name: skip(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."skip"(integer) RETURNS "text"
    LANGUAGE "sql"
    AS $_$SELECT skip(NULL, $1)$_$;


ALTER FUNCTION "public"."skip"(integer) OWNER TO "postgres";

--
-- Name: skip("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."skip"("text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT ok( TRUE ) || ' ' || diag( 'SKIP' || COALESCE(' ' || $1, '') );
$_$;


ALTER FUNCTION "public"."skip"("text") OWNER TO "postgres";

--
-- Name: skip(integer, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."skip"(integer, "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$SELECT skip($2, $1)$_$;


ALTER FUNCTION "public"."skip"(integer, "text") OWNER TO "postgres";

--
-- Name: skip("text", integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."skip"("why" "text", "how_many" integer) RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    output TEXT[];
BEGIN
    output := '{}';
    FOR i IN 1..how_many LOOP
        output = array_append(
            output,
            ok( TRUE ) || ' ' || diag( 'SKIP' || COALESCE( ' ' || why, '') )
        );
    END LOOP;
    RETURN array_to_string(output, E'\n');
END;
$$;


ALTER FUNCTION "public"."skip"("why" "text", "how_many" integer) OWNER TO "postgres";

--
-- Name: throws_ok("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."throws_ok"("text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT throws_ok( $1, NULL, NULL, NULL );
$_$;


ALTER FUNCTION "public"."throws_ok"("text") OWNER TO "postgres";

--
-- Name: throws_ok("text", integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."throws_ok"("text", integer) RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT throws_ok( $1, $2::char(5), NULL, NULL );
$_$;


ALTER FUNCTION "public"."throws_ok"("text", integer) OWNER TO "postgres";

--
-- Name: throws_ok("text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."throws_ok"("text", "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    IF octet_length($2) = 5 THEN
        RETURN throws_ok( $1, $2::char(5), NULL, NULL );
    ELSE
        RETURN throws_ok( $1, NULL, $2, NULL );
    END IF;
END;
$_$;


ALTER FUNCTION "public"."throws_ok"("text", "text") OWNER TO "postgres";

--
-- Name: throws_ok("text", integer, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."throws_ok"("text", integer, "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT throws_ok( $1, $2::char(5), $3, NULL );
$_$;


ALTER FUNCTION "public"."throws_ok"("text", integer, "text") OWNER TO "postgres";

--
-- Name: throws_ok("text", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."throws_ok"("text", "text", "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    IF octet_length($2) = 5 THEN
        RETURN throws_ok( $1, $2::char(5), $3, NULL );
    ELSE
        RETURN throws_ok( $1, NULL, $2, $3 );
    END IF;
END;
$_$;


ALTER FUNCTION "public"."throws_ok"("text", "text", "text") OWNER TO "postgres";

--
-- Name: throws_ok("text", character, "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."throws_ok"("text", character, "text", "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    query     TEXT := _query($1);
    errcode   ALIAS FOR $2;
    errmsg    ALIAS FOR $3;
    desctext  ALIAS FOR $4;
    descr     TEXT;
BEGIN
    descr := COALESCE(
          desctext,
          'threw ' || errcode || ': ' || errmsg,
          'threw ' || errcode,
          'threw ' || errmsg,
          'threw an exception'
    );
    EXECUTE query;
    RETURN ok( FALSE, descr ) || E'\n' || diag(
           '      caught: no exception' ||
        E'\n      wanted: ' || COALESCE( errcode, 'an exception' )
    );
EXCEPTION WHEN OTHERS OR ASSERT_FAILURE THEN
    IF (errcode IS NULL OR SQLSTATE = errcode)
        AND ( errmsg IS NULL OR SQLERRM = errmsg)
    THEN
        -- The expected errcode and/or message was thrown.
        RETURN ok( TRUE, descr );
    ELSE
        -- This was not the expected errcode or errmsg.
        RETURN ok( FALSE, descr ) || E'\n' || diag(
               '      caught: ' || SQLSTATE || ': ' || SQLERRM ||
            E'\n      wanted: ' || COALESCE( errcode, 'an exception' ) ||
            COALESCE( ': ' || errmsg, '')
        );
    END IF;
END;
$_$;


ALTER FUNCTION "public"."throws_ok"("text", character, "text", "text") OWNER TO "postgres";

--
-- Name: throws_ok("text", integer, "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."throws_ok"("text", integer, "text", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT throws_ok( $1, $2::char(5), $3, $4 );
$_$;


ALTER FUNCTION "public"."throws_ok"("text", integer, "text", "text") OWNER TO "postgres";

--
-- Name: todo(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."todo"("how_many" integer) RETURNS SETOF boolean
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM _add('todo', COALESCE(how_many, 1), '');
    RETURN;
END;
$$;


ALTER FUNCTION "public"."todo"("how_many" integer) OWNER TO "postgres";

--
-- Name: todo("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."todo"("why" "text") RETURNS SETOF boolean
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM _add('todo', 1, COALESCE(why, ''));
    RETURN;
END;
$$;


ALTER FUNCTION "public"."todo"("why" "text") OWNER TO "postgres";

--
-- Name: todo(integer, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."todo"("how_many" integer, "why" "text") RETURNS SETOF boolean
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM _add('todo', COALESCE(how_many, 1), COALESCE(why, ''));
    RETURN;
END;
$$;


ALTER FUNCTION "public"."todo"("how_many" integer, "why" "text") OWNER TO "postgres";

--
-- Name: todo("text", integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."todo"("why" "text", "how_many" integer) RETURNS SETOF boolean
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM _add('todo', COALESCE(how_many, 1), COALESCE(why, ''));
    RETURN;
END;
$$;


ALTER FUNCTION "public"."todo"("why" "text", "how_many" integer) OWNER TO "postgres";

--
-- Name: todo_end(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."todo_end"() RETURNS SETOF boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    id integer;
BEGIN
    id := _get_latest( 'todo', -1 );
    IF id IS NULL THEN
        RAISE EXCEPTION 'todo_end() called without todo_start()';
    END IF;
    EXECUTE 'DELETE FROM __tcache__ WHERE id = ' || id;
    RETURN;
END;
$$;


ALTER FUNCTION "public"."todo_end"() OWNER TO "postgres";

--
-- Name: todo_start(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."todo_start"() RETURNS SETOF boolean
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM _add('todo', -1, '');
    RETURN;
END;
$$;


ALTER FUNCTION "public"."todo_start"() OWNER TO "postgres";

--
-- Name: todo_start("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."todo_start"("text") RETURNS SETOF boolean
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    PERFORM _add('todo', -1, COALESCE($1, ''));
    RETURN;
END;
$_$;


ALTER FUNCTION "public"."todo_start"("text") OWNER TO "postgres";

--
-- Name: truncate_all_tables(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."truncate_all_tables"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    schema_name TEXT;
    table_name TEXT;
BEGIN
    FOR schema_name IN
        SELECT schema_name
        FROM information_schema.schemata
        WHERE schema_name NOT IN ('information_schema', 'pg_catalog')
    LOOP
        FOR table_name IN
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = schema_name
            AND table_type = 'BASE TABLE'
        LOOP
            EXECUTE 'TRUNCATE TABLE ' || schema_name || '.' || table_name || ' CASCADE;';
        END LOOP;
    END LOOP;
END;
$$;


ALTER FUNCTION "public"."truncate_all_tables"() OWNER TO "postgres";

--
-- Name: truncate_all_tables("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."truncate_all_tables"("schema_name" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    table_name TEXT;
BEGIN
    FOR table_name IN
        SELECT t.table_name
        FROM information_schema.tables t
        WHERE t.table_schema = schema_name
        AND t.table_type = 'BASE TABLE'
    LOOP
        EXECUTE 'TRUNCATE TABLE ' || schema_name || '.' || table_name || ' CASCADE;';
    END LOOP;
END;
$$;


ALTER FUNCTION "public"."truncate_all_tables"("schema_name" "text") OWNER TO "postgres";

--
-- Name: unalike("anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."unalike"("anyelement", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT _unalike( $1 !~~ $2, $1, $2, NULL );
$_$;


ALTER FUNCTION "public"."unalike"("anyelement", "text") OWNER TO "postgres";

--
-- Name: unalike("anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."unalike"("anyelement", "text", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT _unalike( $1 !~~ $2, $1, $2, $3 );
$_$;


ALTER FUNCTION "public"."unalike"("anyelement", "text", "text") OWNER TO "postgres";

--
-- Name: unialike("anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."unialike"("anyelement", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT _unalike( $1 !~~* $2, $1, $2, NULL );
$_$;


ALTER FUNCTION "public"."unialike"("anyelement", "text") OWNER TO "postgres";

--
-- Name: unialike("anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."unialike"("anyelement", "text", "text") RETURNS "text"
    LANGUAGE "sql"
    AS $_$
    SELECT _unalike( $1 !~~* $2, $1, $2, $3 );
$_$;


ALTER FUNCTION "public"."unialike"("anyelement", "text", "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: campaign_creators; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."campaign_creators" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "status" "text",
    "campaign_id" "uuid",
    "updated_at" timestamp with time zone,
    "relay_creator_id" bigint,
    "creator_model" "text",
    "creator_token" "text",
    "interested" boolean,
    "email_sent" boolean,
    "publication_date" timestamp with time zone,
    "rate_cents" bigint DEFAULT '0'::bigint NOT NULL,
    "rate_currency" "text" DEFAULT 'USD'::"text" NOT NULL,
    "payment_details" "text",
    "payment_status" "text" DEFAULT '''unpaid''::text'::"text" NOT NULL,
    "paid_amount_cents" bigint DEFAULT '0'::bigint NOT NULL,
    "paid_amount_currency" "text" DEFAULT 'USD'::"text" NOT NULL,
    "address" "text",
    "sample_status" "text" DEFAULT '''unsent''::text'::"text" NOT NULL,
    "tracking_details" "text",
    "reject_message" "text",
    "brief_opened_by_creator" boolean,
    "need_support" boolean,
    "next_step" "text",
    "avatar_url" "text" NOT NULL,
    "username" "text",
    "fullname" "text",
    "link_url" "text",
    "creator_id" "text" NOT NULL,
    "platform" "text" DEFAULT ''::"text" NOT NULL,
    "added_by_id" "uuid" NOT NULL
);


ALTER TABLE "public"."campaign_creators" OWNER TO "postgres";

--
-- Name: campaign_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."campaign_notes" (
    "created_at" timestamp with time zone DEFAULT "now"(),
    "comment" "text",
    "user_id" "uuid" NOT NULL,
    "campaign_creator_id" "uuid" NOT NULL,
    "important" boolean DEFAULT false NOT NULL,
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL
);


ALTER TABLE "public"."campaign_notes" OWNER TO "postgres";

--
-- Name: campaigns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."campaigns" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "company_id" "uuid" NOT NULL,
    "product_link" "text",
    "status" "text",
    "budget_cents" bigint,
    "budget_currency" "text",
    "creator_count" smallint,
    "date_end_creator_outreach" timestamp with time zone,
    "date_start_campaign" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "date_end_campaign" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "slug" "text",
    "product_name" "text",
    "requirements" "text",
    "tag_list" "text"[],
    "promo_types" "text"[],
    "target_locations" "text"[],
    "media" "json"[],
    "purge_media" "json"[],
    "media_path" "text"[]
);


ALTER TABLE "public"."campaigns" OWNER TO "postgres";

--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."companies" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "name" "text",
    "website" "text",
    "avatar_url" "text",
    "updated_at" timestamp with time zone,
    "cus_id" "text",
    "searches_limit" "text" DEFAULT ''::"text" NOT NULL,
    "profiles_limit" "text" DEFAULT ''::"text" NOT NULL,
    "subscription_status" "text" DEFAULT ''::"text" NOT NULL,
    "trial_searches_limit" "text" DEFAULT ''::"text" NOT NULL,
    "trial_profiles_limit" "text" DEFAULT ''::"text" NOT NULL,
    "subscription_start_date" timestamp with time zone,
    "subscription_end_date" "text",
    "subscription_current_period_end" timestamp with time zone,
    "subscription_current_period_start" timestamp with time zone,
    "ai_email_generator_limit" "text" DEFAULT '1000'::"text" NOT NULL,
    "trial_ai_email_generator_limit" "text" DEFAULT '10'::"text" NOT NULL
);


ALTER TABLE "public"."companies" OWNER TO "postgres";

--
-- Name: invites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."invites" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "company_id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "used" boolean DEFAULT false NOT NULL,
    "expire_at" timestamp with time zone DEFAULT ("now"() + '30 days'::interval),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "company_owner" boolean DEFAULT false
);


ALTER TABLE "public"."invites" OWNER TO "postgres";

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "avatar_url" "text",
    "phone" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "company_id" "uuid",
    "last_name" "text" NOT NULL,
    "first_name" "text" NOT NULL,
    "email" "text",
    "user_role" "text"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";

--
-- Name: usages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."usages" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "company_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "item_id" "text"
);


ALTER TABLE "public"."usages" OWNER TO "postgres";

--
-- Name: campaign_creators campaign_creators_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."campaign_creators"
    ADD CONSTRAINT "campaign_creators_pkey" PRIMARY KEY ("id");


--
-- Name: campaign_notes campaign_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."campaign_notes"
    ADD CONSTRAINT "campaign_notes_pkey" PRIMARY KEY ("id");


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."campaigns"
    ADD CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id");


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_pkey" PRIMARY KEY ("id");


--
-- Name: invites invites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."invites"
    ADD CONSTRAINT "invites_pkey" PRIMARY KEY ("id");


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");


--
-- Name: usages usages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."usages"
    ADD CONSTRAINT "usages_pkey" PRIMARY KEY ("id");


--
-- Name: campaign_creators campaign_creators_added_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."campaign_creators"
    ADD CONSTRAINT "campaign_creators_added_by_id_fkey" FOREIGN KEY ("added_by_id") REFERENCES "public"."profiles"("id");


--
-- Name: campaign_creators campaign_creators_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."campaign_creators"
    ADD CONSTRAINT "campaign_creators_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id");


--
-- Name: campaign_notes campaign_notes_campaign_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."campaign_notes"
    ADD CONSTRAINT "campaign_notes_campaign_creator_id_fkey" FOREIGN KEY ("campaign_creator_id") REFERENCES "public"."campaign_creators"("id");


--
-- Name: campaign_notes campaign_notes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."campaign_notes"
    ADD CONSTRAINT "campaign_notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");


--
-- Name: campaigns campaigns_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."campaigns"
    ADD CONSTRAINT "campaigns_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");


--
-- Name: invites invites_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."invites"
    ADD CONSTRAINT "invites_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");


--
-- Name: profiles profiles_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");


--
-- Name: usages usages_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."usages"
    ADD CONSTRAINT "usages_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");


--
-- Name: campaigns Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON "public"."campaigns" FOR INSERT TO "authenticated" WITH CHECK (true);


--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles profiles_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "profiles_policy" ON "public"."profiles" USING ((("id" = "auth"."uid"()) OR (( SELECT "profiles_1"."user_role"
   FROM "public"."profiles" "profiles_1"
  WHERE ("profiles_1"."id" = "auth"."uid"())) = 'relay_employee'::"text"))) WITH CHECK (((( SELECT "profiles_1"."user_role"
   FROM "public"."profiles" "profiles_1"
  WHERE ("profiles_1"."id" = "auth"."uid"())) = "user_role") AND (( SELECT "profiles_1"."company_id"
   FROM "public"."profiles" "profiles_1"
  WHERE ("profiles_1"."id" = "auth"."uid"())) = "company_id")));


--
-- Name: SCHEMA "net"; Type: ACL; Schema: -; Owner: supabase_admin
--

-- GRANT USAGE ON SCHEMA "net" TO "supabase_functions_admin";
-- GRANT USAGE ON SCHEMA "net" TO "anon";
-- GRANT USAGE ON SCHEMA "net" TO "authenticated";
-- GRANT USAGE ON SCHEMA "net" TO "service_role";


--
-- Name: SCHEMA "public"; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT ALL ON SCHEMA "public" TO PUBLIC;


--
-- Name: FUNCTION "_add"("text", integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_add"("text", integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_add"("text", integer, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_add"("text", integer, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_alike"(boolean, "anyelement", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_alike"(boolean, "anyelement", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_ancestor_of"("name", "name", integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_ancestor_of"("name", "name", integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_ancestor_of"("name", "name", "name", "name", integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_ancestor_of"("name", "name", "name", "name", integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_are"("text", "name"[], "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_are"("text", "name"[], "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_areni"("text", "text"[], "text"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_areni"("text", "text"[], "text"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_array_to_sorted_string"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_array_to_sorted_string"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_assets_are"("text", "text"[], "text"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_assets_are"("text", "text"[], "text"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_cast_exists"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_cast_exists"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_cast_exists"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_cast_exists"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_cast_exists"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_cast_exists"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_cdi"("name", "name", "anyelement"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_cdi"("name", "name", "anyelement") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_cdi"("name", "name", "anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_cdi"("name", "name", "anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_cdi"("name", "name", "name", "anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_cdi"("name", "name", "name", "anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_cexists"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_cexists"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_cexists"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_cexists"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_ckeys"("name", character); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_ckeys"("name", character) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_ckeys"("name", "name", character); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_ckeys"("name", "name", character) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_cleanup"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_cleanup"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_cmp_types"("oid", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_cmp_types"("oid", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_col_is_null"("name", "name", "text", boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_col_is_null"("name", "name", "text", boolean) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_col_is_null"("name", "name", "name", "text", boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_col_is_null"("name", "name", "name", "text", boolean) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_constraint"("name", character, "name"[], "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_constraint"("name", character, "name"[], "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_constraint"("name", "name", character, "name"[], "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_constraint"("name", "name", character, "name"[], "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_contract_on"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_contract_on"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_currtest"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_currtest"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_db_privs"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_db_privs"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_def_is"("text", "text", "anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_def_is"("text", "text", "anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_definer"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_definer"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_definer"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_definer"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_definer"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_definer"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_definer"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_definer"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_dexists"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_dexists"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_dexists"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_dexists"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_do_ne"("text", "text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_do_ne"("text", "text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_docomp"("text", "text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_docomp"("text", "text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_error_diag"("text", "text", "text", "text", "text", "text", "text", "text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_error_diag"("text", "text", "text", "text", "text", "text", "text", "text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_expand_context"(character); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_expand_context"(character) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_expand_on"(character); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_expand_on"(character) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_expand_vol"(character); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_expand_vol"(character) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_ext_exists"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_ext_exists"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_ext_exists"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_ext_exists"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_extensions"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_extensions"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_extensions"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_extensions"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_extras"(character[], "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_extras"(character[], "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_extras"(character, "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_extras"(character, "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_extras"(character[], "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_extras"(character[], "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_extras"(character, "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_extras"(character, "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_finish"(integer, integer, integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_finish"(integer, integer, integer, boolean) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_fkexists"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_fkexists"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_fkexists"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_fkexists"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_fprivs_are"("text", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_fprivs_are"("text", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_func_compare"("name", "name", boolean, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_func_compare"("name", "name", boolean, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_func_compare"("name", "name", "name"[], boolean, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_func_compare"("name", "name", "name"[], boolean, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_func_compare"("name", "name", "anyelement", "anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_func_compare"("name", "name", "anyelement", "anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_func_compare"("name", "name", "name"[], "anyelement", "anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_func_compare"("name", "name", "name"[], "anyelement", "anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_funkargs"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_funkargs"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_ac_privs"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_ac_privs"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_col_ns_type"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_col_ns_type"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_col_privs"("name", "text", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_col_privs"("name", "text", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_col_type"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_col_type"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_col_type"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_col_type"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_context"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_context"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_db_owner"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_db_owner"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_db_privs"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_db_privs"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_dtype"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_dtype"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_dtype"("name", "text", boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_dtype"("name", "text", boolean) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_fdw_privs"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_fdw_privs"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_func_owner"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_func_owner"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_func_owner"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_func_owner"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_func_privs"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_func_privs"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_index_owner"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_index_owner"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_index_owner"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_index_owner"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_lang_privs"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_lang_privs"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_language_owner"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_language_owner"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_latest"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_latest"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_latest"("text", integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_latest"("text", integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_note"(integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_note"(integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_note"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_note"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_opclass_owner"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_opclass_owner"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_opclass_owner"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_opclass_owner"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_rel_owner"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_rel_owner"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_rel_owner"(character[], "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_rel_owner"(character[], "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_rel_owner"(character, "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_rel_owner"(character, "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_rel_owner"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_rel_owner"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_rel_owner"(character[], "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_rel_owner"(character[], "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_rel_owner"(character, "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_rel_owner"(character, "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_schema_owner"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_schema_owner"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_schema_privs"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_schema_privs"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_sequence_privs"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_sequence_privs"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_server_privs"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_server_privs"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_table_privs"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_table_privs"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_tablespace_owner"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_tablespace_owner"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_tablespaceprivs"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_tablespaceprivs"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_type_owner"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_type_owner"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_get_type_owner"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_get_type_owner"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_got_func"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_got_func"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_got_func"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_got_func"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_got_func"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_got_func"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_got_func"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_got_func"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_grolist"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_grolist"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_has_def"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_has_def"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_has_def"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_has_def"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_has_group"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_has_group"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_has_role"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_has_role"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_has_type"("name", character[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_has_type"("name", character[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_has_type"("name", "name", character[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_has_type"("name", "name", character[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_has_user"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_has_user"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_hasc"("name", character); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_hasc"("name", character) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_hasc"("name", "name", character); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_hasc"("name", "name", character) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_have_index"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_have_index"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_have_index"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_have_index"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_ident_array_to_sorted_string"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_ident_array_to_sorted_string"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_ident_array_to_string"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_ident_array_to_string"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_ikeys"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_ikeys"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_ikeys"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_ikeys"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_inherited"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_inherited"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_inherited"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_inherited"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_is_indexed"("name", "name", "text"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_is_indexed"("name", "name", "text"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_is_instead"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_is_instead"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_is_instead"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_is_instead"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_is_schema"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_is_schema"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_is_super"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_is_super"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_is_trusted"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_is_trusted"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_is_verbose"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_is_verbose"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_keys"("name", character); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_keys"("name", character) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_keys"("name", "name", character); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_keys"("name", "name", character) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_lang"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_lang"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_lang"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_lang"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_lang"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_lang"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_lang"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_lang"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_missing"(character[], "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_missing"(character[], "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_missing"(character, "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_missing"(character, "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_missing"(character[], "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_missing"(character[], "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_missing"(character, "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_missing"(character, "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_nosuch"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_nosuch"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_op_exists"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_op_exists"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_op_exists"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_op_exists"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_op_exists"("name", "name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_op_exists"("name", "name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_opc_exists"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_opc_exists"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_opc_exists"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_opc_exists"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_partof"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_partof"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_partof"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_partof"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_parts"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_parts"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_parts"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_parts"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_pg_sv_column_array"("oid", smallint[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_pg_sv_column_array"("oid", smallint[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_pg_sv_table_accessible"("oid", "oid"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_pg_sv_table_accessible"("oid", "oid") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_pg_sv_type_array"("oid"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_pg_sv_type_array"("oid"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_prokind"("p_oid" "oid"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_prokind"("p_oid" "oid") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_query"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_query"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_quote_ident_like"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_quote_ident_like"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_refine_vol"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_refine_vol"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_relcomp"("text", "anyarray", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_relcomp"("text", "anyarray", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_relcomp"("text", "text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_relcomp"("text", "text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_relcomp"("text", "text", "text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_relcomp"("text", "text", "text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_relexists"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_relexists"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_relexists"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_relexists"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_relne"("text", "anyarray", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_relne"("text", "anyarray", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_relne"("text", "text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_relne"("text", "text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_returns"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_returns"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_returns"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_returns"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_returns"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_returns"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_returns"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_returns"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_rexists"(character[], "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_rexists"(character[], "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_rexists"(character, "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_rexists"(character, "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_rexists"(character[], "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_rexists"(character[], "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_rexists"(character, "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_rexists"(character, "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_rule_on"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_rule_on"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_rule_on"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_rule_on"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_runem"("text"[], boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_runem"("text"[], boolean) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_runner"("text"[], "text"[], "text"[], "text"[], "text"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_runner"("text"[], "text"[], "text"[], "text"[], "text"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_set"(integer, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_set"(integer, integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_set"("text", integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_set"("text", integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_set"("text", integer, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_set"("text", integer, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_strict"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_strict"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_strict"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_strict"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_strict"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_strict"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_strict"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_strict"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_table_privs"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_table_privs"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_temptable"("anyarray", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_temptable"("anyarray", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_temptable"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_temptable"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_temptypes"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_temptypes"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_time_trials"("text", integer, numeric); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_time_trials"("text", integer, numeric) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_tlike"(boolean, "text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_tlike"(boolean, "text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_todo"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_todo"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_trig"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_trig"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_trig"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_trig"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_type_func"("char", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_type_func"("char", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_type_func"("char", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_type_func"("char", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_type_func"("char", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_type_func"("char", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_type_func"("char", "name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_type_func"("char", "name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_types_are"("name"[], "text", character[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_types_are"("name"[], "text", character[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_types_are"("name", "name"[], "text", character[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_types_are"("name", "name"[], "text", character[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_unalike"(boolean, "anyelement", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_unalike"(boolean, "anyelement", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_vol"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_vol"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_vol"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_vol"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_vol"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_vol"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "_vol"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."_vol"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "add_result"(boolean, boolean, "text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."add_result"(boolean, boolean, "text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "alike"("anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."alike"("anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "alike"("anyelement", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."alike"("anyelement", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "any_column_privs_are"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."any_column_privs_are"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "any_column_privs_are"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."any_column_privs_are"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "any_column_privs_are"("name", "name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."any_column_privs_are"("name", "name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "any_column_privs_are"("name", "name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."any_column_privs_are"("name", "name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "armor"("bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."armor"("bytea") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."armor"("bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."armor"("bytea") TO "dashboard_user";


--
-- Name: FUNCTION "armor"("bytea", "text"[], "text"[]); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) TO "dashboard_user";


--
-- Name: FUNCTION "bag_eq"("text", "anyarray"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."bag_eq"("text", "anyarray") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "bag_eq"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."bag_eq"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "bag_eq"("text", "anyarray", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."bag_eq"("text", "anyarray", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "bag_eq"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."bag_eq"("text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "bag_has"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."bag_has"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "bag_has"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."bag_has"("text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "bag_hasnt"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."bag_hasnt"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "bag_hasnt"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."bag_hasnt"("text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "bag_ne"("text", "anyarray"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."bag_ne"("text", "anyarray") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "bag_ne"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."bag_ne"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "bag_ne"("text", "anyarray", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."bag_ne"("text", "anyarray", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "bag_ne"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."bag_ne"("text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "can"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."can"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "can"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."can"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "can"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."can"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "can"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."can"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "cast_context_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."cast_context_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "cast_context_is"("name", "name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."cast_context_is"("name", "name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "casts_are"("text"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."casts_are"("text"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "casts_are"("text"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."casts_are"("text"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "check_test"("text", boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."check_test"("text", boolean) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "check_test"("text", boolean, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."check_test"("text", boolean, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "check_test"("text", boolean, "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."check_test"("text", boolean, "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "check_test"("text", boolean, "text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."check_test"("text", boolean, "text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "check_test"("text", boolean, "text", "text", "text", boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."check_test"("text", boolean, "text", "text", "text", boolean) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "cmp_ok"("anyelement", "text", "anyelement"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."cmp_ok"("anyelement", "text", "anyelement") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "cmp_ok"("anyelement", "text", "anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."cmp_ok"("anyelement", "text", "anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_default_is"("name", "name", "anyelement"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_default_is"("name", "name", "anyelement") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_default_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_default_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_default_is"("name", "name", "anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_default_is"("name", "name", "anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_default_is"("name", "name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_default_is"("name", "name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_default_is"("name", "name", "name", "anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_default_is"("name", "name", "name", "anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_default_is"("name", "name", "name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_default_is"("name", "name", "name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_has_check"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_has_check"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_has_check"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_has_check"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_has_check"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_has_check"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_has_check"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_has_check"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_has_check"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_has_check"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_has_check"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_has_check"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_has_default"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_has_default"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_has_default"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_has_default"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_has_default"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_has_default"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_hasnt_default"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_hasnt_default"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_hasnt_default"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_hasnt_default"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_hasnt_default"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_hasnt_default"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_fk"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_fk"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_fk"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_fk"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_fk"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_fk"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_fk"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_fk"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_fk"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_fk"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_fk"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_fk"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_null"("table_name" "name", "column_name" "name", "description" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_null"("table_name" "name", "column_name" "name", "description" "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_null"("schema_name" "name", "table_name" "name", "column_name" "name", "description" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_null"("schema_name" "name", "table_name" "name", "column_name" "name", "description" "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_pk"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_pk"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_pk"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_pk"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_pk"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_pk"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_pk"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_pk"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_pk"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_pk"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_pk"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_pk"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_unique"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_unique"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_unique"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_unique"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_unique"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_unique"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_unique"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_unique"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_unique"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_unique"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_unique"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_unique"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_unique"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_unique"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_is_unique"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_is_unique"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_isnt_fk"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_isnt_fk"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_isnt_fk"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_isnt_fk"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_isnt_fk"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_isnt_fk"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_isnt_fk"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_isnt_fk"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_isnt_fk"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_isnt_fk"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_isnt_fk"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_isnt_fk"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_isnt_pk"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_isnt_pk"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_isnt_pk"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_isnt_pk"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_isnt_pk"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_isnt_pk"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_isnt_pk"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_isnt_pk"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_isnt_pk"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_isnt_pk"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_isnt_pk"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_isnt_pk"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_not_null"("table_name" "name", "column_name" "name", "description" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_not_null"("table_name" "name", "column_name" "name", "description" "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_not_null"("schema_name" "name", "table_name" "name", "column_name" "name", "description" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_not_null"("schema_name" "name", "table_name" "name", "column_name" "name", "description" "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_type_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_type_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_type_is"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_type_is"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_type_is"("name", "name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_type_is"("name", "name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_type_is"("name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_type_is"("name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_type_is"("name", "name", "name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_type_is"("name", "name", "name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "col_type_is"("name", "name", "name", "name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."col_type_is"("name", "name", "name", "name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "collect_tap"(VARIADIC "text"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."collect_tap"(VARIADIC "text"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "collect_tap"(character varying[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."collect_tap"(character varying[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "column_privs_are"("name", "name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."column_privs_are"("name", "name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "column_privs_are"("name", "name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."column_privs_are"("name", "name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "column_privs_are"("name", "name", "name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."column_privs_are"("name", "name", "name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "column_privs_are"("name", "name", "name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."column_privs_are"("name", "name", "name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "columns_are"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."columns_are"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "columns_are"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."columns_are"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "columns_are"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."columns_are"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "columns_are"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."columns_are"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "composite_owner_is"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."composite_owner_is"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "composite_owner_is"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."composite_owner_is"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "composite_owner_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."composite_owner_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "composite_owner_is"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."composite_owner_is"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "crypt"("text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."crypt"("text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."crypt"("text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."crypt"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "database_privs_are"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."database_privs_are"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "database_privs_are"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."database_privs_are"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "db_owner_is"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."db_owner_is"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "db_owner_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."db_owner_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "dearmor"("text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."dearmor"("text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."dearmor"("text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."dearmor"("text") TO "dashboard_user";


--
-- Name: FUNCTION "decrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "decrypt_iv"("bytea", "bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "diag"(VARIADIC "text"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."diag"(VARIADIC "text"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "diag"(VARIADIC "anyarray"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."diag"(VARIADIC "anyarray") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "diag"("msg" "anyelement"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."diag"("msg" "anyelement") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "diag"("msg" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."diag"("msg" "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "diag_test_name"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."diag_test_name"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "digest"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."digest"("bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."digest"("bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."digest"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "digest"("text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."digest"("text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."digest"("text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."digest"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "display_oper"("name", "oid"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."display_oper"("name", "oid") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "do_tap"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."do_tap"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "do_tap"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."do_tap"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "do_tap"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."do_tap"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "do_tap"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."do_tap"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "doesnt_imatch"("anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."doesnt_imatch"("anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "doesnt_imatch"("anyelement", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."doesnt_imatch"("anyelement", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "doesnt_match"("anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."doesnt_match"("anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "doesnt_match"("anyelement", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."doesnt_match"("anyelement", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "domain_type_is"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."domain_type_is"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "domain_type_is"("name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."domain_type_is"("name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "domain_type_is"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."domain_type_is"("text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "domain_type_is"("name", "text", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."domain_type_is"("name", "text", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "domain_type_is"("name", "text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."domain_type_is"("name", "text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "domain_type_is"("name", "text", "name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."domain_type_is"("name", "text", "name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "domain_type_isnt"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."domain_type_isnt"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "domain_type_isnt"("name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."domain_type_isnt"("name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "domain_type_isnt"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."domain_type_isnt"("text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "domain_type_isnt"("name", "text", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."domain_type_isnt"("name", "text", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "domain_type_isnt"("name", "text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."domain_type_isnt"("name", "text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "domain_type_isnt"("name", "text", "name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."domain_type_isnt"("name", "text", "name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "domains_are"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."domains_are"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "domains_are"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."domains_are"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "domains_are"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."domains_are"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "domains_are"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."domains_are"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "encrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "encrypt_iv"("bytea", "bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "enum_has_labels"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."enum_has_labels"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "enum_has_labels"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."enum_has_labels"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "enum_has_labels"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."enum_has_labels"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "enum_has_labels"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."enum_has_labels"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "enums_are"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."enums_are"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "enums_are"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."enums_are"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "enums_are"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."enums_are"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "enums_are"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."enums_are"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "extensions_are"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."extensions_are"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "extensions_are"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."extensions_are"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "extensions_are"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."extensions_are"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "extensions_are"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."extensions_are"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "fail"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."fail"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "fail"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."fail"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "fdw_privs_are"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."fdw_privs_are"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "fdw_privs_are"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."fdw_privs_are"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "findfuncs"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."findfuncs"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "findfuncs"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."findfuncs"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "findfuncs"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."findfuncs"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "findfuncs"("name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."findfuncs"("name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "finish"("exception_on_failure" boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."finish"("exception_on_failure" boolean) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "fk_ok"("name", "name"[], "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."fk_ok"("name", "name"[], "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "fk_ok"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."fk_ok"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "fk_ok"("name", "name"[], "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."fk_ok"("name", "name"[], "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "fk_ok"("name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."fk_ok"("name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "fk_ok"("name", "name", "name"[], "name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."fk_ok"("name", "name", "name"[], "name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "fk_ok"("name", "name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."fk_ok"("name", "name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "fk_ok"("name", "name", "name"[], "name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."fk_ok"("name", "name", "name"[], "name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "fk_ok"("name", "name", "name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."fk_ok"("name", "name", "name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "foreign_table_owner_is"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."foreign_table_owner_is"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "foreign_table_owner_is"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."foreign_table_owner_is"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "foreign_table_owner_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."foreign_table_owner_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "foreign_table_owner_is"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."foreign_table_owner_is"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "foreign_tables_are"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."foreign_tables_are"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "foreign_tables_are"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."foreign_tables_are"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "foreign_tables_are"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."foreign_tables_are"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "foreign_tables_are"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."foreign_tables_are"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_lang_is"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_lang_is"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_lang_is"("name", "name"[], "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_lang_is"("name", "name"[], "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_lang_is"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_lang_is"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_lang_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_lang_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_lang_is"("name", "name"[], "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_lang_is"("name", "name"[], "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_lang_is"("name", "name", "name"[], "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_lang_is"("name", "name", "name"[], "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_lang_is"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_lang_is"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_lang_is"("name", "name", "name"[], "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_lang_is"("name", "name", "name"[], "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_owner_is"("name", "name"[], "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_owner_is"("name", "name"[], "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_owner_is"("name", "name"[], "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_owner_is"("name", "name"[], "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_owner_is"("name", "name", "name"[], "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_owner_is"("name", "name", "name"[], "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_owner_is"("name", "name", "name"[], "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_owner_is"("name", "name", "name"[], "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_privs_are"("name", "name"[], "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_privs_are"("name", "name"[], "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_privs_are"("name", "name"[], "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_privs_are"("name", "name"[], "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_privs_are"("name", "name", "name"[], "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_privs_are"("name", "name", "name"[], "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_privs_are"("name", "name", "name"[], "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_privs_are"("name", "name", "name"[], "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_returns"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_returns"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_returns"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_returns"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_returns"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_returns"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_returns"("name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_returns"("name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_returns"("name", "name"[], "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_returns"("name", "name"[], "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_returns"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_returns"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_returns"("name", "name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_returns"("name", "name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "function_returns"("name", "name", "name"[], "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."function_returns"("name", "name", "name"[], "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "functions_are"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."functions_are"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "functions_are"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."functions_are"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "functions_are"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."functions_are"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "functions_are"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."functions_are"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "gen_random_bytes"(integer); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) TO "dashboard_user";


--
-- Name: FUNCTION "gen_random_uuid"(); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."gen_random_uuid"() FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."gen_random_uuid"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."gen_random_uuid"() TO "dashboard_user";


--
-- Name: FUNCTION "gen_salt"("text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."gen_salt"("text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."gen_salt"("text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."gen_salt"("text") TO "dashboard_user";


--
-- Name: FUNCTION "gen_salt"("text", integer); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."gen_salt"("text", integer) FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."gen_salt"("text", integer) TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."gen_salt"("text", integer) TO "dashboard_user";


--
-- Name: FUNCTION "groups_are"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."groups_are"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "groups_are"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."groups_are"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_cast"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_cast"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_cast"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_cast"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_cast"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_cast"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_cast"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_cast"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_cast"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_cast"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_cast"("name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_cast"("name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_check"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_check"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_check"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_check"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_check"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_check"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_column"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_column"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_column"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_column"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_column"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_column"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_composite"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_composite"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_composite"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_composite"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_composite"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_composite"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_domain"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_domain"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_domain"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_domain"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_domain"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_domain"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_domain"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_domain"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_enum"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_enum"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_enum"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_enum"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_enum"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_enum"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_enum"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_enum"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_extension"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_extension"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_extension"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_extension"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_extension"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_extension"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_extension"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_extension"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_fk"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_fk"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_fk"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_fk"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_fk"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_fk"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_foreign_table"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_foreign_table"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_foreign_table"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_foreign_table"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_foreign_table"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_foreign_table"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_foreign_table"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_foreign_table"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_function"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_function"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_function"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_function"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_function"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_function"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_function"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_function"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_function"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_function"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_function"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_function"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_function"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_function"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_function"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_function"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_group"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_group"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_group"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_group"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_index"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_index"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_index"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_index"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_index"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_index"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_index"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_index"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_index"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_index"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_index"("name", "name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_index"("name", "name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_index"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_index"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_index"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_index"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_index"("name", "name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_index"("name", "name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_index"("name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_index"("name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_inherited_tables"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_inherited_tables"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_inherited_tables"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_inherited_tables"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_inherited_tables"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_inherited_tables"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_inherited_tables"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_inherited_tables"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_language"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_language"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_language"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_language"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_leftop"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_leftop"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_leftop"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_leftop"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_leftop"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_leftop"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_leftop"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_leftop"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_leftop"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_leftop"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_leftop"("name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_leftop"("name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_materialized_view"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_materialized_view"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_materialized_view"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_materialized_view"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_materialized_view"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_materialized_view"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_opclass"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_opclass"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_opclass"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_opclass"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_opclass"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_opclass"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_opclass"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_opclass"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_operator"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_operator"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_operator"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_operator"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_operator"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_operator"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_operator"("name", "name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_operator"("name", "name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_operator"("name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_operator"("name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_operator"("name", "name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_operator"("name", "name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_pk"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_pk"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_pk"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_pk"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_pk"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_pk"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_relation"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_relation"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_relation"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_relation"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_relation"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_relation"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_rightop"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_rightop"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_rightop"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_rightop"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_rightop"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_rightop"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_rightop"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_rightop"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_rightop"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_rightop"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_rightop"("name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_rightop"("name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_role"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_role"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_role"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_role"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_rule"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_rule"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_rule"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_rule"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_rule"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_rule"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_rule"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_rule"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_schema"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_schema"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_schema"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_schema"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_sequence"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_sequence"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_sequence"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_sequence"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_sequence"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_sequence"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_sequence"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_sequence"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_table"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_table"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_table"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_table"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_table"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_table"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_table"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_table"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_tablespace"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_tablespace"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_tablespace"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_tablespace"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_tablespace"("name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_tablespace"("name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_trigger"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_trigger"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_trigger"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_trigger"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_trigger"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_trigger"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_trigger"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_trigger"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_type"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_type"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_type"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_type"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_type"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_type"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_type"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_type"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_unique"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_unique"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_unique"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_unique"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_unique"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_unique"("text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_user"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_user"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_user"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_user"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_view"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_view"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_view"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_view"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_view"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_view"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "has_view"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."has_view"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_cast"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_cast"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_cast"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_cast"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_cast"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_cast"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_cast"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_cast"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_cast"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_cast"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_cast"("name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_cast"("name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_column"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_column"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_column"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_column"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_column"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_column"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_composite"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_composite"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_composite"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_composite"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_composite"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_composite"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_domain"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_domain"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_domain"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_domain"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_domain"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_domain"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_domain"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_domain"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_enum"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_enum"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_enum"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_enum"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_enum"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_enum"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_enum"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_enum"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_extension"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_extension"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_extension"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_extension"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_extension"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_extension"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_extension"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_extension"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_fk"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_fk"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_fk"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_fk"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_fk"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_fk"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_foreign_table"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_foreign_table"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_foreign_table"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_foreign_table"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_foreign_table"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_foreign_table"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_foreign_table"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_foreign_table"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_function"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_function"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_function"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_function"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_function"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_function"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_function"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_function"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_function"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_function"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_function"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_function"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_function"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_function"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_function"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_function"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_group"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_group"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_group"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_group"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_index"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_index"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_index"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_index"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_index"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_index"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_index"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_index"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_inherited_tables"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_inherited_tables"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_inherited_tables"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_inherited_tables"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_inherited_tables"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_inherited_tables"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_inherited_tables"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_inherited_tables"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_language"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_language"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_language"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_language"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_leftop"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_leftop"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_leftop"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_leftop"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_leftop"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_leftop"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_leftop"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_leftop"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_leftop"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_leftop"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_leftop"("name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_leftop"("name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_materialized_view"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_materialized_view"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_materialized_view"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_materialized_view"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_materialized_view"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_materialized_view"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_opclass"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_opclass"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_opclass"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_opclass"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_opclass"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_opclass"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_opclass"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_opclass"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_operator"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_operator"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_operator"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_operator"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_operator"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_operator"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_operator"("name", "name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_operator"("name", "name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_operator"("name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_operator"("name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_operator"("name", "name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_operator"("name", "name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_pk"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_pk"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_pk"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_pk"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_pk"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_pk"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_relation"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_relation"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_relation"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_relation"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_relation"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_relation"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_rightop"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_rightop"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_rightop"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_rightop"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_rightop"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_rightop"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_rightop"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_rightop"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_rightop"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_rightop"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_rightop"("name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_rightop"("name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_role"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_role"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_role"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_role"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_rule"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_rule"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_rule"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_rule"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_rule"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_rule"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_rule"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_rule"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_schema"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_schema"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_schema"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_schema"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_sequence"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_sequence"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_sequence"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_sequence"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_sequence"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_sequence"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_table"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_table"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_table"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_table"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_table"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_table"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_table"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_table"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_tablespace"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_tablespace"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_tablespace"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_tablespace"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_trigger"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_trigger"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_trigger"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_trigger"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_trigger"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_trigger"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_trigger"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_trigger"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_type"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_type"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_type"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_type"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_type"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_type"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_type"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_type"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_user"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_user"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_user"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_user"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_view"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_view"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_view"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_view"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_view"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_view"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hasnt_view"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hasnt_view"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "hmac"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "hmac"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "ialike"("anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."ialike"("anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "ialike"("anyelement", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."ialike"("anyelement", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "imatches"("anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."imatches"("anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "imatches"("anyelement", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."imatches"("anyelement", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "in_todo"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."in_todo"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "index_is_primary"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."index_is_primary"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "index_is_primary"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."index_is_primary"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "index_is_primary"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."index_is_primary"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "index_is_primary"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."index_is_primary"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "index_is_type"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."index_is_type"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "index_is_type"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."index_is_type"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "index_is_type"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."index_is_type"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "index_is_type"("name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."index_is_type"("name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "index_is_unique"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."index_is_unique"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "index_is_unique"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."index_is_unique"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "index_is_unique"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."index_is_unique"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "index_is_unique"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."index_is_unique"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "index_owner_is"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."index_owner_is"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "index_owner_is"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."index_owner_is"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "index_owner_is"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."index_owner_is"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "index_owner_is"("name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."index_owner_is"("name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "indexes_are"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."indexes_are"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "indexes_are"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."indexes_are"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "indexes_are"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."indexes_are"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "indexes_are"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."indexes_are"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is"("anyelement", "anyelement"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is"("anyelement", "anyelement") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is"("anyelement", "anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is"("anyelement", "anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_aggregate"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_aggregate"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_aggregate"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_aggregate"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_aggregate"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_aggregate"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_aggregate"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_aggregate"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_aggregate"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_aggregate"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_aggregate"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_aggregate"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_aggregate"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_aggregate"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_aggregate"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_aggregate"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_ancestor_of"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_ancestor_of"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_ancestor_of"("name", "name", integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_ancestor_of"("name", "name", integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_ancestor_of"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_ancestor_of"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_ancestor_of"("name", "name", integer, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_ancestor_of"("name", "name", integer, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_ancestor_of"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_ancestor_of"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_ancestor_of"("name", "name", "name", "name", integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_ancestor_of"("name", "name", "name", "name", integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_ancestor_of"("name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_ancestor_of"("name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_ancestor_of"("name", "name", "name", "name", integer, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_ancestor_of"("name", "name", "name", "name", integer, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_clustered"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_clustered"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_clustered"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_clustered"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_clustered"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_clustered"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_clustered"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_clustered"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_definer"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_definer"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_definer"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_definer"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_definer"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_definer"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_definer"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_definer"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_definer"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_definer"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_definer"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_definer"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_definer"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_definer"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_definer"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_definer"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_descendent_of"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_descendent_of"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_descendent_of"("name", "name", integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_descendent_of"("name", "name", integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_descendent_of"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_descendent_of"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_descendent_of"("name", "name", integer, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_descendent_of"("name", "name", integer, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_descendent_of"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_descendent_of"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_descendent_of"("name", "name", "name", "name", integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_descendent_of"("name", "name", "name", "name", integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_descendent_of"("name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_descendent_of"("name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_descendent_of"("name", "name", "name", "name", integer, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_descendent_of"("name", "name", "name", "name", integer, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_empty"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_empty"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_empty"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_empty"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_indexed"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_indexed"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_indexed"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_indexed"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_indexed"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_indexed"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_indexed"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_indexed"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_indexed"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_indexed"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_indexed"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_indexed"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_indexed"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_indexed"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_member_of"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_member_of"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_member_of"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_member_of"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_member_of"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_member_of"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_member_of"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_member_of"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_normal_function"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_normal_function"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_normal_function"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_normal_function"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_normal_function"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_normal_function"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_normal_function"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_normal_function"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_normal_function"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_normal_function"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_normal_function"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_normal_function"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_normal_function"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_normal_function"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_normal_function"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_normal_function"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_partition_of"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_partition_of"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_partition_of"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_partition_of"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_partition_of"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_partition_of"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_partition_of"("name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_partition_of"("name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_partitioned"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_partitioned"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_partitioned"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_partitioned"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_partitioned"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_partitioned"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_partitioned"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_partitioned"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_procedure"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_procedure"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_procedure"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_procedure"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_procedure"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_procedure"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_procedure"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_procedure"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_procedure"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_procedure"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_procedure"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_procedure"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_procedure"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_procedure"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_procedure"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_procedure"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_strict"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_strict"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_strict"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_strict"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_strict"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_strict"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_strict"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_strict"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_strict"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_strict"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_strict"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_strict"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_strict"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_strict"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_strict"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_strict"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_superuser"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_superuser"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_superuser"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_superuser"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_window"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_window"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_window"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_window"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_window"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_window"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_window"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_window"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_window"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_window"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_window"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_window"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_window"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_window"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "is_window"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."is_window"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isa_ok"("anyelement", "regtype"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isa_ok"("anyelement", "regtype") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isa_ok"("anyelement", "regtype", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isa_ok"("anyelement", "regtype", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt"("anyelement", "anyelement"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt"("anyelement", "anyelement") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt"("anyelement", "anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt"("anyelement", "anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_aggregate"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_aggregate"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_aggregate"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_aggregate"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_aggregate"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_aggregate"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_aggregate"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_aggregate"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_aggregate"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_aggregate"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_aggregate"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_aggregate"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_aggregate"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_aggregate"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_aggregate"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_aggregate"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_ancestor_of"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_ancestor_of"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_ancestor_of"("name", "name", integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_ancestor_of"("name", "name", integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_ancestor_of"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_ancestor_of"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_ancestor_of"("name", "name", integer, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_ancestor_of"("name", "name", integer, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_ancestor_of"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_ancestor_of"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_ancestor_of"("name", "name", "name", "name", integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_ancestor_of"("name", "name", "name", "name", integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_ancestor_of"("name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_ancestor_of"("name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_ancestor_of"("name", "name", "name", "name", integer, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_ancestor_of"("name", "name", "name", "name", integer, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_definer"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_definer"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_definer"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_definer"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_definer"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_definer"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_definer"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_definer"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_definer"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_definer"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_definer"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_definer"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_definer"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_definer"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_definer"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_definer"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_descendent_of"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_descendent_of"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_descendent_of"("name", "name", integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_descendent_of"("name", "name", integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_descendent_of"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_descendent_of"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_descendent_of"("name", "name", integer, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_descendent_of"("name", "name", integer, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_descendent_of"("name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_descendent_of"("name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_descendent_of"("name", "name", "name", "name", integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_descendent_of"("name", "name", "name", "name", integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_descendent_of"("name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_descendent_of"("name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_descendent_of"("name", "name", "name", "name", integer, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_descendent_of"("name", "name", "name", "name", integer, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_empty"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_empty"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_empty"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_empty"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_member_of"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_member_of"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_member_of"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_member_of"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_member_of"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_member_of"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_member_of"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_member_of"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_normal_function"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_normal_function"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_normal_function"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_normal_function"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_normal_function"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_normal_function"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_normal_function"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_normal_function"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_normal_function"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_normal_function"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_normal_function"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_normal_function"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_normal_function"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_normal_function"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_normal_function"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_normal_function"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_partitioned"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_partitioned"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_partitioned"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_partitioned"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_partitioned"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_partitioned"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_partitioned"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_partitioned"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_procedure"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_procedure"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_procedure"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_procedure"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_procedure"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_procedure"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_procedure"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_procedure"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_procedure"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_procedure"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_procedure"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_procedure"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_procedure"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_procedure"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_procedure"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_procedure"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_strict"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_strict"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_strict"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_strict"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_strict"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_strict"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_strict"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_strict"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_strict"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_strict"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_strict"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_strict"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_strict"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_strict"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_strict"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_strict"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_superuser"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_superuser"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_superuser"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_superuser"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_window"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_window"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_window"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_window"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_window"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_window"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_window"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_window"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_window"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_window"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_window"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_window"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_window"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_window"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "isnt_window"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."isnt_window"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "language_is_trusted"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."language_is_trusted"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "language_is_trusted"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."language_is_trusted"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "language_owner_is"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."language_owner_is"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "language_owner_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."language_owner_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "language_privs_are"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."language_privs_are"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "language_privs_are"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."language_privs_are"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "languages_are"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."languages_are"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "languages_are"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."languages_are"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "lives_ok"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."lives_ok"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "lives_ok"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."lives_ok"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "matches"("anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."matches"("anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "matches"("anyelement", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."matches"("anyelement", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "materialized_view_owner_is"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."materialized_view_owner_is"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "materialized_view_owner_is"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."materialized_view_owner_is"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "materialized_view_owner_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."materialized_view_owner_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "materialized_view_owner_is"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."materialized_view_owner_is"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "materialized_views_are"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."materialized_views_are"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "materialized_views_are"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."materialized_views_are"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "materialized_views_are"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."materialized_views_are"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "materialized_views_are"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."materialized_views_are"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "no_plan"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."no_plan"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "num_failed"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."num_failed"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "ok"(boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."ok"(boolean) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "ok"(boolean, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."ok"(boolean, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "opclass_owner_is"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."opclass_owner_is"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "opclass_owner_is"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."opclass_owner_is"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "opclass_owner_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."opclass_owner_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "opclass_owner_is"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."opclass_owner_is"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "opclasses_are"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."opclasses_are"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "opclasses_are"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."opclasses_are"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "opclasses_are"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."opclasses_are"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "opclasses_are"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."opclasses_are"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "operators_are"("text"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."operators_are"("text"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "operators_are"("text"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."operators_are"("text"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "operators_are"("name", "text"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."operators_are"("name", "text"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "operators_are"("name", "text"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."operators_are"("name", "text"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "os_name"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."os_name"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "partitions_are"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."partitions_are"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "partitions_are"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."partitions_are"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "partitions_are"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."partitions_are"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "partitions_are"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."partitions_are"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "pass"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pass"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "pass"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pass"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "performs_ok"("text", numeric); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."performs_ok"("text", numeric) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "performs_ok"("text", numeric, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."performs_ok"("text", numeric, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "performs_within"("text", numeric, numeric); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."performs_within"("text", numeric, numeric) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "performs_within"("text", numeric, numeric, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."performs_within"("text", numeric, numeric, integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "performs_within"("text", numeric, numeric, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."performs_within"("text", numeric, numeric, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "performs_within"("text", numeric, numeric, integer, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."performs_within"("text", numeric, numeric, integer, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision) FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision) TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision) TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint) FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint) TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint) TO "dashboard_user";


--
-- Name: FUNCTION "pg_version"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pg_version"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "pg_version_num"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pg_version_num"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_key_id"("bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt"("text", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt"("text", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt_bytea"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt_bytea"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt_bytea"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt_bytea"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt"("text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt_bytea"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt_bytea"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgtap_version"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgtap_version"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "plan"(integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."plan"(integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "policies_are"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."policies_are"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "policies_are"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."policies_are"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "policies_are"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."policies_are"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "policies_are"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."policies_are"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "policy_cmd_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."policy_cmd_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "policy_cmd_is"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."policy_cmd_is"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "policy_cmd_is"("name", "name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."policy_cmd_is"("name", "name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "policy_cmd_is"("name", "name", "name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."policy_cmd_is"("name", "name", "name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "policy_roles_are"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."policy_roles_are"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "policy_roles_are"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."policy_roles_are"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "policy_roles_are"("name", "name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."policy_roles_are"("name", "name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "policy_roles_are"("name", "name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."policy_roles_are"("name", "name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "relation_owner_is"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."relation_owner_is"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "relation_owner_is"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."relation_owner_is"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "relation_owner_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."relation_owner_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "relation_owner_is"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."relation_owner_is"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_eq"("refcursor", "anyarray"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_eq"("refcursor", "anyarray") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_eq"("refcursor", "refcursor"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_eq"("refcursor", "refcursor") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_eq"("refcursor", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_eq"("refcursor", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_eq"("text", "anyarray"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_eq"("text", "anyarray") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_eq"("text", "refcursor"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_eq"("text", "refcursor") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_eq"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_eq"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_eq"("refcursor", "anyarray", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_eq"("refcursor", "anyarray", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_eq"("refcursor", "refcursor", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_eq"("refcursor", "refcursor", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_eq"("refcursor", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_eq"("refcursor", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_eq"("text", "anyarray", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_eq"("text", "anyarray", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_eq"("text", "refcursor", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_eq"("text", "refcursor", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_eq"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_eq"("text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_ne"("refcursor", "anyarray"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_ne"("refcursor", "anyarray") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_ne"("refcursor", "refcursor"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_ne"("refcursor", "refcursor") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_ne"("refcursor", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_ne"("refcursor", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_ne"("text", "anyarray"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_ne"("text", "anyarray") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_ne"("text", "refcursor"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_ne"("text", "refcursor") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_ne"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_ne"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_ne"("refcursor", "anyarray", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_ne"("refcursor", "anyarray", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_ne"("refcursor", "refcursor", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_ne"("refcursor", "refcursor", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_ne"("refcursor", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_ne"("refcursor", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_ne"("text", "anyarray", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_ne"("text", "anyarray", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_ne"("text", "refcursor", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_ne"("text", "refcursor", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "results_ne"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."results_ne"("text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "roles_are"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."roles_are"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "roles_are"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."roles_are"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "row_eq"("text", "anyelement"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."row_eq"("text", "anyelement") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "row_eq"("text", "anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."row_eq"("text", "anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "rule_is_instead"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."rule_is_instead"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "rule_is_instead"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."rule_is_instead"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "rule_is_instead"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."rule_is_instead"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "rule_is_instead"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."rule_is_instead"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "rule_is_on"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."rule_is_on"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "rule_is_on"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."rule_is_on"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "rule_is_on"("name", "name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."rule_is_on"("name", "name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "rule_is_on"("name", "name", "name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."rule_is_on"("name", "name", "name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "rules_are"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."rules_are"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "rules_are"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."rules_are"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "rules_are"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."rules_are"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "rules_are"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."rules_are"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "runtests"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."runtests"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "runtests"("name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."runtests"("name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "runtests"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."runtests"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "runtests"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."runtests"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "schema_owner_is"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."schema_owner_is"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "schema_owner_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."schema_owner_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "schema_privs_are"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."schema_privs_are"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "schema_privs_are"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."schema_privs_are"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "schemas_are"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."schemas_are"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "schemas_are"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."schemas_are"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "sequence_owner_is"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."sequence_owner_is"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "sequence_owner_is"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."sequence_owner_is"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "sequence_owner_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."sequence_owner_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "sequence_owner_is"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."sequence_owner_is"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "sequence_privs_are"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."sequence_privs_are"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "sequence_privs_are"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."sequence_privs_are"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "sequence_privs_are"("name", "name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."sequence_privs_are"("name", "name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "sequence_privs_are"("name", "name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."sequence_privs_are"("name", "name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "sequences_are"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."sequences_are"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "sequences_are"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."sequences_are"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "sequences_are"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."sequences_are"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "sequences_are"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."sequences_are"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "server_privs_are"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."server_privs_are"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "server_privs_are"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."server_privs_are"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "set_eq"("text", "anyarray"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."set_eq"("text", "anyarray") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "set_eq"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."set_eq"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "set_eq"("text", "anyarray", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."set_eq"("text", "anyarray", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "set_eq"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."set_eq"("text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "set_has"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."set_has"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "set_has"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."set_has"("text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "set_hasnt"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."set_hasnt"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "set_hasnt"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."set_hasnt"("text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "set_ne"("text", "anyarray"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."set_ne"("text", "anyarray") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "set_ne"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."set_ne"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "set_ne"("text", "anyarray", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."set_ne"("text", "anyarray", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "set_ne"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."set_ne"("text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "sign"("payload" "json", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."sign"("payload" "json", "secret" "text", "algorithm" "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."sign"("payload" "json", "secret" "text", "algorithm" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."sign"("payload" "json", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "skip"(integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."skip"(integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "skip"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."skip"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "skip"(integer, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."skip"(integer, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "skip"("why" "text", "how_many" integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."skip"("why" "text", "how_many" integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "table_owner_is"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."table_owner_is"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "table_owner_is"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."table_owner_is"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "table_owner_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."table_owner_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "table_owner_is"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."table_owner_is"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "table_privs_are"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."table_privs_are"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "table_privs_are"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."table_privs_are"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "table_privs_are"("name", "name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."table_privs_are"("name", "name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "table_privs_are"("name", "name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."table_privs_are"("name", "name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "tables_are"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."tables_are"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "tables_are"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."tables_are"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "tables_are"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."tables_are"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "tables_are"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."tables_are"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "tablespace_owner_is"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."tablespace_owner_is"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "tablespace_owner_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."tablespace_owner_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "tablespace_privs_are"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."tablespace_privs_are"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "tablespace_privs_are"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."tablespace_privs_are"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "tablespaces_are"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."tablespaces_are"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "tablespaces_are"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."tablespaces_are"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "throws_ilike"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."throws_ilike"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "throws_ilike"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."throws_ilike"("text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "throws_imatching"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."throws_imatching"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "throws_imatching"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."throws_imatching"("text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "throws_like"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."throws_like"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "throws_like"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."throws_like"("text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "throws_matching"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."throws_matching"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "throws_matching"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."throws_matching"("text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "throws_ok"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."throws_ok"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "throws_ok"("text", integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."throws_ok"("text", integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "throws_ok"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."throws_ok"("text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "throws_ok"("text", integer, "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."throws_ok"("text", integer, "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "throws_ok"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."throws_ok"("text", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "throws_ok"("text", character, "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."throws_ok"("text", character, "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "throws_ok"("text", integer, "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."throws_ok"("text", integer, "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "todo"("how_many" integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."todo"("how_many" integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "todo"("why" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."todo"("why" "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "todo"("how_many" integer, "why" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."todo"("how_many" integer, "why" "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "todo"("why" "text", "how_many" integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."todo"("why" "text", "how_many" integer) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "todo_end"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."todo_end"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "todo_start"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."todo_start"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "todo_start"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."todo_start"("text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "trigger_is"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."trigger_is"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "trigger_is"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."trigger_is"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "trigger_is"("name", "name", "name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."trigger_is"("name", "name", "name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "trigger_is"("name", "name", "name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."trigger_is"("name", "name", "name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "triggers_are"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."triggers_are"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "triggers_are"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."triggers_are"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "triggers_are"("name", "name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."triggers_are"("name", "name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "triggers_are"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."triggers_are"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "try_cast_double"("inp" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."try_cast_double"("inp" "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."try_cast_double"("inp" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."try_cast_double"("inp" "text") TO "dashboard_user";


--
-- Name: FUNCTION "type_owner_is"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."type_owner_is"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "type_owner_is"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."type_owner_is"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "type_owner_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."type_owner_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "type_owner_is"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."type_owner_is"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "types_are"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."types_are"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "types_are"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."types_are"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "types_are"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."types_are"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "types_are"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."types_are"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "unalike"("anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."unalike"("anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "unalike"("anyelement", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."unalike"("anyelement", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "unialike"("anyelement", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."unialike"("anyelement", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "unialike"("anyelement", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."unialike"("anyelement", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "url_decode"("data" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."url_decode"("data" "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."url_decode"("data" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."url_decode"("data" "text") TO "dashboard_user";


--
-- Name: FUNCTION "url_encode"("data" "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."url_encode"("data" "bytea") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."url_encode"("data" "bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."url_encode"("data" "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "users_are"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."users_are"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "users_are"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."users_are"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "uuid_generate_v1"(); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v1"() FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v1mc"(); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v3"("namespace" "uuid", "name" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v4"(); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v4"() FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v4"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v4"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v5"("namespace" "uuid", "name" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_nil"(); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_nil"() FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_nil"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_nil"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_dns"(); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_ns_dns"() FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_dns"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_dns"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_oid"(); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_ns_oid"() FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_oid"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_oid"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_url"(); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_ns_url"() FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_url"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_url"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_x500"(); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."uuid_ns_x500"() FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_x500"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_x500"() TO "dashboard_user";


--
-- Name: FUNCTION "verify"("token" "text", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON FUNCTION "extensions"."verify"("token" "text", "secret" "text", "algorithm" "text") FROM "postgres";
-- GRANT ALL ON FUNCTION "extensions"."verify"("token" "text", "secret" "text", "algorithm" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."verify"("token" "text", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "view_owner_is"("name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."view_owner_is"("name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "view_owner_is"("name", "name", "name"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."view_owner_is"("name", "name", "name") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "view_owner_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."view_owner_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "view_owner_is"("name", "name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."view_owner_is"("name", "name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "views_are"("name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."views_are"("name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "views_are"("name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."views_are"("name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "views_are"("name", "name"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."views_are"("name", "name"[]) TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "views_are"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."views_are"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "volatility_is"("name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."volatility_is"("name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "volatility_is"("name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."volatility_is"("name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "volatility_is"("name", "name", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."volatility_is"("name", "name", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "volatility_is"("name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."volatility_is"("name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "volatility_is"("name", "name"[], "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."volatility_is"("name", "name"[], "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "volatility_is"("name", "name", "name"[], "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."volatility_is"("name", "name", "name"[], "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "volatility_is"("name", "name", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."volatility_is"("name", "name", "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "volatility_is"("name", "name", "name"[], "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."volatility_is"("name", "name", "name"[], "text", "text") TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "comment_directive"("comment_" "text"); Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "postgres";
-- GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "anon";
-- GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "service_role";


--
-- Name: FUNCTION "exception"("message" "text"); Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "postgres";
-- GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "anon";
-- GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "service_role";


--
-- Name: FUNCTION "get_schema_version"(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "postgres";
-- GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "anon";
-- GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "service_role";


--
-- Name: FUNCTION "increment_schema_version"(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "postgres";
-- GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "anon";
-- GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "service_role";


--
-- Name: FUNCTION "graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb"); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "postgres";
-- GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "anon";
-- GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "service_role";


--
-- Name: FUNCTION "http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer); Type: ACL; Schema: net; Owner: supabase_admin
--

-- REVOKE ALL ON FUNCTION "net"."http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) FROM PUBLIC;
-- GRANT ALL ON FUNCTION "net"."http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "supabase_functions_admin";
-- GRANT ALL ON FUNCTION "net"."http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "postgres";
-- GRANT ALL ON FUNCTION "net"."http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "anon";
-- GRANT ALL ON FUNCTION "net"."http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "authenticated";
-- GRANT ALL ON FUNCTION "net"."http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "service_role";


--
-- Name: FUNCTION "http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer); Type: ACL; Schema: net; Owner: supabase_admin
--

-- REVOKE ALL ON FUNCTION "net"."http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) FROM PUBLIC;
-- GRANT ALL ON FUNCTION "net"."http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "supabase_functions_admin";
-- GRANT ALL ON FUNCTION "net"."http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "postgres";
-- GRANT ALL ON FUNCTION "net"."http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "anon";
-- GRANT ALL ON FUNCTION "net"."http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "authenticated";
-- GRANT ALL ON FUNCTION "net"."http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "service_role";


--
-- Name: FUNCTION "crypto_aead_det_decrypt"("message" "bytea", "additional" "bytea", "key_uuid" "uuid", "nonce" "bytea"); Type: ACL; Schema: pgsodium; Owner: pgsodium_keymaker
--

-- GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_decrypt"("message" "bytea", "additional" "bytea", "key_uuid" "uuid", "nonce" "bytea") TO "service_role";


--
-- Name: FUNCTION "crypto_aead_det_encrypt"("message" "bytea", "additional" "bytea", "key_uuid" "uuid", "nonce" "bytea"); Type: ACL; Schema: pgsodium; Owner: pgsodium_keymaker
--

-- GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_encrypt"("message" "bytea", "additional" "bytea", "key_uuid" "uuid", "nonce" "bytea") TO "service_role";


--
-- Name: FUNCTION "crypto_aead_det_keygen"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_keygen"() TO "service_role";


--
-- Name: FUNCTION "_add"("text", integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_add"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."_add"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_add"("text", integer) TO "service_role";


--
-- Name: FUNCTION "_add"("text", integer, "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_add"("text", integer, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_add"("text", integer, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_add"("text", integer, "text") TO "service_role";


--
-- Name: FUNCTION "_alike"(boolean, "anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_alike"(boolean, "anyelement", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_alike"(boolean, "anyelement", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_alike"(boolean, "anyelement", "text", "text") TO "service_role";


--
-- Name: FUNCTION "_error_diag"("text", "text", "text", "text", "text", "text", "text", "text", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_error_diag"("text", "text", "text", "text", "text", "text", "text", "text", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_error_diag"("text", "text", "text", "text", "text", "text", "text", "text", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_error_diag"("text", "text", "text", "text", "text", "text", "text", "text", "text", "text") TO "service_role";


--
-- Name: FUNCTION "_finish"(integer, integer, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_finish"(integer, integer, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."_finish"(integer, integer, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_finish"(integer, integer, integer) TO "service_role";


--
-- Name: FUNCTION "_get"("text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_get"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."_get"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_get"("text") TO "service_role";


--
-- Name: FUNCTION "_get_latest"("text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_get_latest"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."_get_latest"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_get_latest"("text") TO "service_role";


--
-- Name: FUNCTION "_get_latest"("text", integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_get_latest"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."_get_latest"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_get_latest"("text", integer) TO "service_role";


--
-- Name: FUNCTION "_get_note"(integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_get_note"(integer) TO "anon";
GRANT ALL ON FUNCTION "public"."_get_note"(integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_get_note"(integer) TO "service_role";


--
-- Name: FUNCTION "_get_note"("text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_get_note"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."_get_note"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_get_note"("text") TO "service_role";


--
-- Name: FUNCTION "_query"("text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_query"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."_query"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_query"("text") TO "service_role";


--
-- Name: FUNCTION "_relexists"("name"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_relexists"("name") TO "anon";
GRANT ALL ON FUNCTION "public"."_relexists"("name") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_relexists"("name") TO "service_role";


--
-- Name: FUNCTION "_relexists"("name", "name"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_relexists"("name", "name") TO "anon";
GRANT ALL ON FUNCTION "public"."_relexists"("name", "name") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_relexists"("name", "name") TO "service_role";


--
-- Name: FUNCTION "_rexists"(character[], "name"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_rexists"(character[], "name") TO "anon";
GRANT ALL ON FUNCTION "public"."_rexists"(character[], "name") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_rexists"(character[], "name") TO "service_role";


--
-- Name: FUNCTION "_rexists"(character, "name"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_rexists"(character, "name") TO "anon";
GRANT ALL ON FUNCTION "public"."_rexists"(character, "name") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_rexists"(character, "name") TO "service_role";


--
-- Name: FUNCTION "_rexists"(character[], "name", "name"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_rexists"(character[], "name", "name") TO "anon";
GRANT ALL ON FUNCTION "public"."_rexists"(character[], "name", "name") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_rexists"(character[], "name", "name") TO "service_role";


--
-- Name: FUNCTION "_rexists"(character, "name", "name"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_rexists"(character, "name", "name") TO "anon";
GRANT ALL ON FUNCTION "public"."_rexists"(character, "name", "name") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_rexists"(character, "name", "name") TO "service_role";


--
-- Name: FUNCTION "_set"(integer, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_set"(integer, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."_set"(integer, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_set"(integer, integer) TO "service_role";


--
-- Name: FUNCTION "_set"("text", integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_set"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."_set"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_set"("text", integer) TO "service_role";


--
-- Name: FUNCTION "_set"("text", integer, "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_set"("text", integer, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_set"("text", integer, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_set"("text", integer, "text") TO "service_role";


--
-- Name: FUNCTION "_time_trials"("text", integer, numeric); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_time_trials"("text", integer, numeric) TO "anon";
GRANT ALL ON FUNCTION "public"."_time_trials"("text", integer, numeric) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_time_trials"("text", integer, numeric) TO "service_role";


--
-- Name: FUNCTION "_todo"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_todo"() TO "anon";
GRANT ALL ON FUNCTION "public"."_todo"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."_todo"() TO "service_role";


--
-- Name: FUNCTION "_unalike"(boolean, "anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."_unalike"(boolean, "anyelement", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_unalike"(boolean, "anyelement", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_unalike"(boolean, "anyelement", "text", "text") TO "service_role";


--
-- Name: FUNCTION "add_result"(boolean, boolean, "text", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."add_result"(boolean, boolean, "text", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."add_result"(boolean, boolean, "text", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_result"(boolean, boolean, "text", "text", "text") TO "service_role";


--
-- Name: FUNCTION "alike"("anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."alike"("anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."alike"("anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."alike"("anyelement", "text") TO "service_role";


--
-- Name: FUNCTION "alike"("anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."alike"("anyelement", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."alike"("anyelement", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."alike"("anyelement", "text", "text") TO "service_role";


--
-- Name: FUNCTION "cmp_ok"("anyelement", "text", "anyelement"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."cmp_ok"("anyelement", "text", "anyelement") TO "anon";
GRANT ALL ON FUNCTION "public"."cmp_ok"("anyelement", "text", "anyelement") TO "authenticated";
GRANT ALL ON FUNCTION "public"."cmp_ok"("anyelement", "text", "anyelement") TO "service_role";


--
-- Name: FUNCTION "cmp_ok"("anyelement", "text", "anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."cmp_ok"("anyelement", "text", "anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."cmp_ok"("anyelement", "text", "anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."cmp_ok"("anyelement", "text", "anyelement", "text") TO "service_role";


--
-- Name: FUNCTION "diag"(VARIADIC "text"[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."diag"(VARIADIC "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."diag"(VARIADIC "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."diag"(VARIADIC "text"[]) TO "service_role";


--
-- Name: FUNCTION "diag"(VARIADIC "anyarray"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."diag"(VARIADIC "anyarray") TO "anon";
GRANT ALL ON FUNCTION "public"."diag"(VARIADIC "anyarray") TO "authenticated";
GRANT ALL ON FUNCTION "public"."diag"(VARIADIC "anyarray") TO "service_role";


--
-- Name: FUNCTION "diag"("msg" "anyelement"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."diag"("msg" "anyelement") TO "anon";
GRANT ALL ON FUNCTION "public"."diag"("msg" "anyelement") TO "authenticated";
GRANT ALL ON FUNCTION "public"."diag"("msg" "anyelement") TO "service_role";


--
-- Name: FUNCTION "diag"("msg" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."diag"("msg" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."diag"("msg" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."diag"("msg" "text") TO "service_role";


--
-- Name: FUNCTION "doesnt_imatch"("anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."doesnt_imatch"("anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."doesnt_imatch"("anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."doesnt_imatch"("anyelement", "text") TO "service_role";


--
-- Name: FUNCTION "doesnt_imatch"("anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."doesnt_imatch"("anyelement", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."doesnt_imatch"("anyelement", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."doesnt_imatch"("anyelement", "text", "text") TO "service_role";


--
-- Name: FUNCTION "doesnt_match"("anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."doesnt_match"("anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."doesnt_match"("anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."doesnt_match"("anyelement", "text") TO "service_role";


--
-- Name: FUNCTION "doesnt_match"("anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."doesnt_match"("anyelement", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."doesnt_match"("anyelement", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."doesnt_match"("anyelement", "text", "text") TO "service_role";


--
-- Name: FUNCTION "fail"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."fail"() TO "anon";
GRANT ALL ON FUNCTION "public"."fail"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."fail"() TO "service_role";


--
-- Name: FUNCTION "fail"("text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."fail"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."fail"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fail"("text") TO "service_role";


--
-- Name: FUNCTION "finish"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."finish"() TO "anon";
GRANT ALL ON FUNCTION "public"."finish"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."finish"() TO "service_role";


--
-- Name: FUNCTION "handle_new_user"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


--
-- Name: FUNCTION "has_relation"("name"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."has_relation"("name") TO "anon";
GRANT ALL ON FUNCTION "public"."has_relation"("name") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_relation"("name") TO "service_role";


--
-- Name: FUNCTION "has_relation"("name", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."has_relation"("name", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."has_relation"("name", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_relation"("name", "text") TO "service_role";


--
-- Name: FUNCTION "has_relation"("name", "name", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."has_relation"("name", "name", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."has_relation"("name", "name", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_relation"("name", "name", "text") TO "service_role";


--
-- Name: FUNCTION "has_table"("name"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."has_table"("name") TO "anon";
GRANT ALL ON FUNCTION "public"."has_table"("name") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_table"("name") TO "service_role";


--
-- Name: FUNCTION "has_table"("name", "name"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."has_table"("name", "name") TO "anon";
GRANT ALL ON FUNCTION "public"."has_table"("name", "name") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_table"("name", "name") TO "service_role";


--
-- Name: FUNCTION "has_table"("name", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."has_table"("name", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."has_table"("name", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_table"("name", "text") TO "service_role";


--
-- Name: FUNCTION "has_table"("name", "name", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."has_table"("name", "name", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."has_table"("name", "name", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_table"("name", "name", "text") TO "service_role";


--
-- Name: FUNCTION "has_view"("name"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."has_view"("name") TO "anon";
GRANT ALL ON FUNCTION "public"."has_view"("name") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_view"("name") TO "service_role";


--
-- Name: FUNCTION "has_view"("name", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."has_view"("name", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."has_view"("name", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_view"("name", "text") TO "service_role";


--
-- Name: FUNCTION "has_view"("name", "name", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."has_view"("name", "name", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."has_view"("name", "name", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_view"("name", "name", "text") TO "service_role";


--
-- Name: FUNCTION "hasnt_relation"("name"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."hasnt_relation"("name") TO "anon";
GRANT ALL ON FUNCTION "public"."hasnt_relation"("name") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hasnt_relation"("name") TO "service_role";


--
-- Name: FUNCTION "hasnt_relation"("name", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."hasnt_relation"("name", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."hasnt_relation"("name", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hasnt_relation"("name", "text") TO "service_role";


--
-- Name: FUNCTION "hasnt_relation"("name", "name", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."hasnt_relation"("name", "name", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."hasnt_relation"("name", "name", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hasnt_relation"("name", "name", "text") TO "service_role";


--
-- Name: FUNCTION "hasnt_table"("name"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."hasnt_table"("name") TO "anon";
GRANT ALL ON FUNCTION "public"."hasnt_table"("name") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hasnt_table"("name") TO "service_role";


--
-- Name: FUNCTION "hasnt_table"("name", "name"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."hasnt_table"("name", "name") TO "anon";
GRANT ALL ON FUNCTION "public"."hasnt_table"("name", "name") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hasnt_table"("name", "name") TO "service_role";


--
-- Name: FUNCTION "hasnt_table"("name", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."hasnt_table"("name", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."hasnt_table"("name", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hasnt_table"("name", "text") TO "service_role";


--
-- Name: FUNCTION "hasnt_table"("name", "name", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."hasnt_table"("name", "name", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."hasnt_table"("name", "name", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hasnt_table"("name", "name", "text") TO "service_role";


--
-- Name: FUNCTION "hasnt_view"("name"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."hasnt_view"("name") TO "anon";
GRANT ALL ON FUNCTION "public"."hasnt_view"("name") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hasnt_view"("name") TO "service_role";


--
-- Name: FUNCTION "hasnt_view"("name", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."hasnt_view"("name", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."hasnt_view"("name", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hasnt_view"("name", "text") TO "service_role";


--
-- Name: FUNCTION "hasnt_view"("name", "name", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."hasnt_view"("name", "name", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."hasnt_view"("name", "name", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hasnt_view"("name", "name", "text") TO "service_role";


--
-- Name: FUNCTION "ialike"("anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."ialike"("anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."ialike"("anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ialike"("anyelement", "text") TO "service_role";


--
-- Name: FUNCTION "ialike"("anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."ialike"("anyelement", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."ialike"("anyelement", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ialike"("anyelement", "text", "text") TO "service_role";


--
-- Name: FUNCTION "imatches"("anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."imatches"("anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."imatches"("anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."imatches"("anyelement", "text") TO "service_role";


--
-- Name: FUNCTION "imatches"("anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."imatches"("anyelement", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."imatches"("anyelement", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."imatches"("anyelement", "text", "text") TO "service_role";


--
-- Name: FUNCTION "in_todo"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."in_todo"() TO "anon";
GRANT ALL ON FUNCTION "public"."in_todo"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."in_todo"() TO "service_role";


--
-- Name: FUNCTION "is"("anyelement", "anyelement"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."is"("anyelement", "anyelement") TO "anon";
GRANT ALL ON FUNCTION "public"."is"("anyelement", "anyelement") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is"("anyelement", "anyelement") TO "service_role";


--
-- Name: FUNCTION "is"("anyelement", "anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."is"("anyelement", "anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."is"("anyelement", "anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is"("anyelement", "anyelement", "text") TO "service_role";


--
-- Name: FUNCTION "isnt"("anyelement", "anyelement"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."isnt"("anyelement", "anyelement") TO "anon";
GRANT ALL ON FUNCTION "public"."isnt"("anyelement", "anyelement") TO "authenticated";
GRANT ALL ON FUNCTION "public"."isnt"("anyelement", "anyelement") TO "service_role";


--
-- Name: FUNCTION "isnt"("anyelement", "anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."isnt"("anyelement", "anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."isnt"("anyelement", "anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."isnt"("anyelement", "anyelement", "text") TO "service_role";


--
-- Name: FUNCTION "lives_ok"("text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."lives_ok"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."lives_ok"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."lives_ok"("text") TO "service_role";


--
-- Name: FUNCTION "lives_ok"("text", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."lives_ok"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."lives_ok"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."lives_ok"("text", "text") TO "service_role";


--
-- Name: FUNCTION "matches"("anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."matches"("anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."matches"("anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."matches"("anyelement", "text") TO "service_role";


--
-- Name: FUNCTION "matches"("anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."matches"("anyelement", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."matches"("anyelement", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."matches"("anyelement", "text", "text") TO "service_role";


--
-- Name: FUNCTION "no_plan"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."no_plan"() TO "anon";
GRANT ALL ON FUNCTION "public"."no_plan"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."no_plan"() TO "service_role";


--
-- Name: FUNCTION "num_failed"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."num_failed"() TO "anon";
GRANT ALL ON FUNCTION "public"."num_failed"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."num_failed"() TO "service_role";


--
-- Name: FUNCTION "ok"(boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."ok"(boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."ok"(boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."ok"(boolean) TO "service_role";


--
-- Name: FUNCTION "ok"(boolean, "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."ok"(boolean, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."ok"(boolean, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ok"(boolean, "text") TO "service_role";


--
-- Name: FUNCTION "os_name"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."os_name"() TO "anon";
GRANT ALL ON FUNCTION "public"."os_name"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."os_name"() TO "service_role";


--
-- Name: FUNCTION "pass"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."pass"() TO "anon";
GRANT ALL ON FUNCTION "public"."pass"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."pass"() TO "service_role";


--
-- Name: FUNCTION "pass"("text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."pass"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."pass"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pass"("text") TO "service_role";


--
-- Name: FUNCTION "performs_ok"("text", numeric); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."performs_ok"("text", numeric) TO "anon";
GRANT ALL ON FUNCTION "public"."performs_ok"("text", numeric) TO "authenticated";
GRANT ALL ON FUNCTION "public"."performs_ok"("text", numeric) TO "service_role";


--
-- Name: FUNCTION "performs_ok"("text", numeric, "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."performs_ok"("text", numeric, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."performs_ok"("text", numeric, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."performs_ok"("text", numeric, "text") TO "service_role";


--
-- Name: FUNCTION "performs_within"("text", numeric, numeric); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."performs_within"("text", numeric, numeric) TO "anon";
GRANT ALL ON FUNCTION "public"."performs_within"("text", numeric, numeric) TO "authenticated";
GRANT ALL ON FUNCTION "public"."performs_within"("text", numeric, numeric) TO "service_role";


--
-- Name: FUNCTION "performs_within"("text", numeric, numeric, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."performs_within"("text", numeric, numeric, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."performs_within"("text", numeric, numeric, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."performs_within"("text", numeric, numeric, integer) TO "service_role";


--
-- Name: FUNCTION "performs_within"("text", numeric, numeric, "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."performs_within"("text", numeric, numeric, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."performs_within"("text", numeric, numeric, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."performs_within"("text", numeric, numeric, "text") TO "service_role";


--
-- Name: FUNCTION "performs_within"("text", numeric, numeric, integer, "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."performs_within"("text", numeric, numeric, integer, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."performs_within"("text", numeric, numeric, integer, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."performs_within"("text", numeric, numeric, integer, "text") TO "service_role";


--
-- Name: FUNCTION "pg_version"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."pg_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."pg_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."pg_version"() TO "service_role";


--
-- Name: FUNCTION "pg_version_num"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."pg_version_num"() TO "anon";
GRANT ALL ON FUNCTION "public"."pg_version_num"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."pg_version_num"() TO "service_role";


--
-- Name: FUNCTION "pgtap_version"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."pgtap_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."pgtap_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgtap_version"() TO "service_role";


--
-- Name: FUNCTION "plan"(integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."plan"(integer) TO "anon";
GRANT ALL ON FUNCTION "public"."plan"(integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."plan"(integer) TO "service_role";


--
-- Name: FUNCTION "skip"(integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."skip"(integer) TO "anon";
GRANT ALL ON FUNCTION "public"."skip"(integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."skip"(integer) TO "service_role";


--
-- Name: FUNCTION "skip"("text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."skip"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."skip"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."skip"("text") TO "service_role";


--
-- Name: FUNCTION "skip"(integer, "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."skip"(integer, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."skip"(integer, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."skip"(integer, "text") TO "service_role";


--
-- Name: FUNCTION "skip"("why" "text", "how_many" integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."skip"("why" "text", "how_many" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."skip"("why" "text", "how_many" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."skip"("why" "text", "how_many" integer) TO "service_role";


--
-- Name: FUNCTION "throws_ok"("text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."throws_ok"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."throws_ok"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."throws_ok"("text") TO "service_role";


--
-- Name: FUNCTION "throws_ok"("text", integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."throws_ok"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."throws_ok"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."throws_ok"("text", integer) TO "service_role";


--
-- Name: FUNCTION "throws_ok"("text", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."throws_ok"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."throws_ok"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."throws_ok"("text", "text") TO "service_role";


--
-- Name: FUNCTION "throws_ok"("text", integer, "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."throws_ok"("text", integer, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."throws_ok"("text", integer, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."throws_ok"("text", integer, "text") TO "service_role";


--
-- Name: FUNCTION "throws_ok"("text", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."throws_ok"("text", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."throws_ok"("text", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."throws_ok"("text", "text", "text") TO "service_role";


--
-- Name: FUNCTION "throws_ok"("text", character, "text", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."throws_ok"("text", character, "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."throws_ok"("text", character, "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."throws_ok"("text", character, "text", "text") TO "service_role";


--
-- Name: FUNCTION "throws_ok"("text", integer, "text", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."throws_ok"("text", integer, "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."throws_ok"("text", integer, "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."throws_ok"("text", integer, "text", "text") TO "service_role";


--
-- Name: FUNCTION "todo"("how_many" integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."todo"("how_many" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."todo"("how_many" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."todo"("how_many" integer) TO "service_role";


--
-- Name: FUNCTION "todo"("why" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."todo"("why" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."todo"("why" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."todo"("why" "text") TO "service_role";


--
-- Name: FUNCTION "todo"("how_many" integer, "why" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."todo"("how_many" integer, "why" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."todo"("how_many" integer, "why" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."todo"("how_many" integer, "why" "text") TO "service_role";


--
-- Name: FUNCTION "todo"("why" "text", "how_many" integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."todo"("why" "text", "how_many" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."todo"("why" "text", "how_many" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."todo"("why" "text", "how_many" integer) TO "service_role";


--
-- Name: FUNCTION "todo_end"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."todo_end"() TO "anon";
GRANT ALL ON FUNCTION "public"."todo_end"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."todo_end"() TO "service_role";


--
-- Name: FUNCTION "todo_start"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."todo_start"() TO "anon";
GRANT ALL ON FUNCTION "public"."todo_start"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."todo_start"() TO "service_role";


--
-- Name: FUNCTION "todo_start"("text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."todo_start"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."todo_start"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."todo_start"("text") TO "service_role";


--
-- Name: FUNCTION "truncate_all_tables"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."truncate_all_tables"() TO "anon";
GRANT ALL ON FUNCTION "public"."truncate_all_tables"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."truncate_all_tables"() TO "service_role";


--
-- Name: FUNCTION "truncate_all_tables"("schema_name" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."truncate_all_tables"("schema_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."truncate_all_tables"("schema_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."truncate_all_tables"("schema_name" "text") TO "service_role";


--
-- Name: FUNCTION "unalike"("anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."unalike"("anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."unalike"("anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unalike"("anyelement", "text") TO "service_role";


--
-- Name: FUNCTION "unalike"("anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."unalike"("anyelement", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."unalike"("anyelement", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unalike"("anyelement", "text", "text") TO "service_role";


--
-- Name: FUNCTION "unialike"("anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."unialike"("anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."unialike"("anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unialike"("anyelement", "text") TO "service_role";


--
-- Name: FUNCTION "unialike"("anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."unialike"("anyelement", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."unialike"("anyelement", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unialike"("anyelement", "text", "text") TO "service_role";


--
-- Name: TABLE "pg_stat_statements"; Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON TABLE "extensions"."pg_stat_statements" FROM "postgres";
-- GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "dashboard_user";


--
-- Name: TABLE "pg_stat_statements_info"; Type: ACL; Schema: extensions; Owner: postgres
--

-- REVOKE ALL ON TABLE "extensions"."pg_stat_statements_info" FROM "postgres";
-- GRANT ALL ON TABLE "extensions"."pg_stat_statements_info" TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON TABLE "extensions"."pg_stat_statements_info" TO "dashboard_user";


--
-- Name: SEQUENCE "seq_schema_version"; Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "postgres";
-- GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "anon";
-- GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "authenticated";
-- GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "service_role";


--
-- Name: TABLE "decrypted_key"; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

-- GRANT ALL ON TABLE "pgsodium"."decrypted_key" TO "pgsodium_keyholder";


--
-- Name: TABLE "masking_rule"; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

-- GRANT ALL ON TABLE "pgsodium"."masking_rule" TO "pgsodium_keyholder";


--
-- Name: TABLE "mask_columns"; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

-- GRANT ALL ON TABLE "pgsodium"."mask_columns" TO "pgsodium_keyholder";


--
-- Name: TABLE "campaign_creators"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."campaign_creators" TO "anon";
GRANT ALL ON TABLE "public"."campaign_creators" TO "authenticated";
GRANT ALL ON TABLE "public"."campaign_creators" TO "service_role";


--
-- Name: TABLE "campaign_notes"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."campaign_notes" TO "anon";
GRANT ALL ON TABLE "public"."campaign_notes" TO "authenticated";
GRANT ALL ON TABLE "public"."campaign_notes" TO "service_role";


--
-- Name: TABLE "campaigns"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."campaigns" TO "anon";
GRANT ALL ON TABLE "public"."campaigns" TO "authenticated";
GRANT ALL ON TABLE "public"."campaigns" TO "service_role";


--
-- Name: TABLE "companies"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."companies" TO "anon";
GRANT ALL ON TABLE "public"."companies" TO "authenticated";
GRANT ALL ON TABLE "public"."companies" TO "service_role";


--
-- Name: TABLE "invites"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."invites" TO "anon";
GRANT ALL ON TABLE "public"."invites" TO "authenticated";
GRANT ALL ON TABLE "public"."invites" TO "service_role";


--
-- Name: TABLE "profiles"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";


--
-- Name: TABLE "usages"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."usages" TO "anon";
GRANT ALL ON TABLE "public"."usages" TO "authenticated";
GRANT ALL ON TABLE "public"."usages" TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";


--
-- PostgreSQL database dump complete
--

RESET ALL;
