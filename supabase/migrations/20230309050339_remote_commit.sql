--
-- PostgreSQL database dump
--
-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)
SET
    statement_timeout = 0;

SET
    lock_timeout = 0;

SET
    idle_in_transaction_session_timeout = 0;

SET
    client_encoding = 'UTF8';

SET
    standard_conforming_strings = ON;

SELECT
    pg_catalog.set_config ('search_path', '', FALSE);

SET
    check_function_bodies = FALSE;

SET
    xmloption = CONTENT;

SET
    client_min_messages = warning;

SET
    row_security = OFF;

--
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--
CREATE EXTENSION IF NOT EXISTS "pg_net"
WITH
    SCHEMA "extensions";

--
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--
CREATE EXTENSION IF NOT EXISTS "pgsodium"
WITH
    SCHEMA "pgsodium";

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--
-- *not* creating schema, since initdb creates it
ALTER SCHEMA "public" OWNER TO "postgres";

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--
CREATE EXTENSION IF NOT EXISTS "pg_graphql"
WITH
    SCHEMA "graphql";

--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"
WITH
    SCHEMA "extensions";

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--
CREATE EXTENSION IF NOT EXISTS "pgcrypto"
WITH
    SCHEMA "extensions";

--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--
CREATE EXTENSION IF NOT EXISTS "pgjwt"
WITH
    SCHEMA "extensions";

--
-- Name: pgtap; Type: EXTENSION; Schema: -; Owner: -
--
CREATE EXTENSION IF NOT EXISTS "pgtap"
WITH
    SCHEMA "extensions";

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
WITH
    SCHEMA "extensions";

--
-- Name: _time_trial_type; Type: TYPE; Schema: public; Owner: postgres
--
CREATE TYPE "public"."_time_trial_type" AS ("a_time" NUMERIC);

ALTER TYPE "public"."_time_trial_type" OWNER TO "postgres";

--
-- Name: _add("text", integer); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_add" ("text", INTEGER) RETURNS INTEGER LANGUAGE "sql" AS $_$
    SELECT _add($1, $2, '')
$_$;

ALTER FUNCTION "public"."_add" ("text", INTEGER) OWNER TO "postgres";

--
-- Name: _add("text", integer, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_add" ("text", INTEGER, "text") RETURNS INTEGER LANGUAGE "plpgsql" AS $_$
BEGIN
    EXECUTE 'INSERT INTO __tcache__ (label, value, note) values (' ||
    quote_literal($1) || ', ' || $2 || ', ' || quote_literal(COALESCE($3, '')) || ')';
    RETURN $2;
END;
$_$;

ALTER FUNCTION "public"."_add" ("text", INTEGER, "text") OWNER TO "postgres";

--
-- Name: _alike(boolean, "anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_alike" (BOOLEAN, "anyelement", "text", "text") RETURNS "text" LANGUAGE "plpgsql" AS $_$
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

ALTER FUNCTION "public"."_alike" (BOOLEAN, "anyelement", "text", "text") OWNER TO "postgres";

--
-- Name: _error_diag("text", "text", "text", "text", "text", "text", "text", "text", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_error_diag" (
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text"
) RETURNS "text" LANGUAGE "sql" IMMUTABLE AS $_$
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

ALTER FUNCTION "public"."_error_diag" (
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text"
) OWNER TO "postgres";

--
-- Name: _finish(integer, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_finish" (INTEGER, INTEGER, INTEGER) RETURNS SETOF "text" LANGUAGE "plpgsql" AS $_$
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

ALTER FUNCTION "public"."_finish" (INTEGER, INTEGER, INTEGER) OWNER TO "postgres";

--
-- Name: _get("text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_get" ("text") RETURNS INTEGER LANGUAGE "plpgsql" STRICT AS $_$
DECLARE
    ret integer;
BEGIN
    EXECUTE 'SELECT value FROM __tcache__ WHERE label = ' || quote_literal($1) || ' LIMIT 1' INTO ret;
    RETURN ret;
END;
$_$;

ALTER FUNCTION "public"."_get" ("text") OWNER TO "postgres";

--
-- Name: _get_latest("text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_get_latest" ("text") RETURNS INTEGER[] LANGUAGE "plpgsql" STRICT AS $_$
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

ALTER FUNCTION "public"."_get_latest" ("text") OWNER TO "postgres";

--
-- Name: _get_latest("text", integer); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_get_latest" ("text", INTEGER) RETURNS INTEGER LANGUAGE "plpgsql" STRICT AS $_$
DECLARE
    ret integer;
BEGIN
    EXECUTE 'SELECT MAX(id) FROM __tcache__ WHERE label = ' ||
    quote_literal($1) || ' AND value = ' || $2 INTO ret;
    RETURN ret;
END;
$_$;

ALTER FUNCTION "public"."_get_latest" ("text", INTEGER) OWNER TO "postgres";

--
-- Name: _get_note(integer); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_get_note" (INTEGER) RETURNS "text" LANGUAGE "plpgsql" STRICT AS $_$
DECLARE
    ret text;
BEGIN
    EXECUTE 'SELECT note FROM __tcache__ WHERE id = ' || $1 || ' LIMIT 1' INTO ret;
    RETURN ret;
END;
$_$;

ALTER FUNCTION "public"."_get_note" (INTEGER) OWNER TO "postgres";

--
-- Name: _get_note("text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_get_note" ("text") RETURNS "text" LANGUAGE "plpgsql" STRICT AS $_$
DECLARE
    ret text;
BEGIN
    EXECUTE 'SELECT note FROM __tcache__ WHERE label = ' || quote_literal($1) || ' LIMIT 1' INTO ret;
    RETURN ret;
END;
$_$;

ALTER FUNCTION "public"."_get_note" ("text") OWNER TO "postgres";

--
-- Name: _query("text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_query" ("text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT CASE
        WHEN $1 LIKE '"%' OR $1 !~ '[[:space:]]' THEN 'EXECUTE ' || $1
        ELSE $1
    END;
$_$;

ALTER FUNCTION "public"."_query" ("text") OWNER TO "postgres";

--
-- Name: _relexists("name"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_relexists" ("name") RETURNS BOOLEAN LANGUAGE "sql" AS $_$
    SELECT EXISTS(
        SELECT true
          FROM pg_catalog.pg_class c
         WHERE pg_catalog.pg_table_is_visible(c.oid)
           AND c.relname = $1
    );
$_$;

ALTER FUNCTION "public"."_relexists" ("name") OWNER TO "postgres";

--
-- Name: _relexists("name", "name"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_relexists" ("name", "name") RETURNS BOOLEAN LANGUAGE "sql" AS $_$
    SELECT EXISTS(
        SELECT true
          FROM pg_catalog.pg_namespace n
          JOIN pg_catalog.pg_class c ON n.oid = c.relnamespace
         WHERE n.nspname = $1
           AND c.relname = $2
    );
$_$;

ALTER FUNCTION "public"."_relexists" ("name", "name") OWNER TO "postgres";

--
-- Name: _rexists(character[], "name"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_rexists" (CHARACTER[], "name") RETURNS BOOLEAN LANGUAGE "sql" AS $_$
    SELECT EXISTS(
        SELECT true
          FROM pg_catalog.pg_class c
         WHERE c.relkind = ANY($1)
           AND pg_catalog.pg_table_is_visible(c.oid)
           AND c.relname = $2
    );
$_$;

ALTER FUNCTION "public"."_rexists" (CHARACTER[], "name") OWNER TO "postgres";

--
-- Name: _rexists(character, "name"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_rexists" (CHARACTER, "name") RETURNS BOOLEAN LANGUAGE "sql" AS $_$
SELECT _rexists(ARRAY[$1], $2);
$_$;

ALTER FUNCTION "public"."_rexists" (CHARACTER, "name") OWNER TO "postgres";

--
-- Name: _rexists(character[], "name", "name"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_rexists" (CHARACTER[], "name", "name") RETURNS BOOLEAN LANGUAGE "sql" AS $_$
    SELECT EXISTS(
        SELECT true
          FROM pg_catalog.pg_namespace n
          JOIN pg_catalog.pg_class c ON n.oid = c.relnamespace
         WHERE c.relkind = ANY($1)
           AND n.nspname = $2
           AND c.relname = $3
    );
$_$;

ALTER FUNCTION "public"."_rexists" (CHARACTER[], "name", "name") OWNER TO "postgres";

--
-- Name: _rexists(character, "name", "name"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_rexists" (CHARACTER, "name", "name") RETURNS BOOLEAN LANGUAGE "sql" AS $_$
    SELECT _rexists(ARRAY[$1], $2, $3);
$_$;

ALTER FUNCTION "public"."_rexists" (CHARACTER, "name", "name") OWNER TO "postgres";

--
-- Name: _set(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_set" (INTEGER, INTEGER) RETURNS INTEGER LANGUAGE "plpgsql" AS $_$
BEGIN
    EXECUTE 'UPDATE __tcache__ SET value = ' || $2
        || ' WHERE id = ' || $1;
    RETURN $2;
END;
$_$;

ALTER FUNCTION "public"."_set" (INTEGER, INTEGER) OWNER TO "postgres";

--
-- Name: _set("text", integer); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_set" ("text", INTEGER) RETURNS INTEGER LANGUAGE "sql" AS $_$
    SELECT _set($1, $2, '')
$_$;

ALTER FUNCTION "public"."_set" ("text", INTEGER) OWNER TO "postgres";

--
-- Name: _set("text", integer, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_set" ("text", INTEGER, "text") RETURNS INTEGER LANGUAGE "plpgsql" AS $_$
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

ALTER FUNCTION "public"."_set" ("text", INTEGER, "text") OWNER TO "postgres";

--
-- Name: _time_trials("text", integer, numeric); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_time_trials" ("text", INTEGER, NUMERIC) RETURNS SETOF "public"."_time_trial_type" LANGUAGE "plpgsql" AS $_$
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

ALTER FUNCTION "public"."_time_trials" ("text", INTEGER, NUMERIC) OWNER TO "postgres";

--
-- Name: _todo(); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_todo" () RETURNS "text" LANGUAGE "plpgsql" AS $$
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

ALTER FUNCTION "public"."_todo" () OWNER TO "postgres";

--
-- Name: _unalike(boolean, "anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."_unalike" (BOOLEAN, "anyelement", "text", "text") RETURNS "text" LANGUAGE "plpgsql" AS $_$
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

ALTER FUNCTION "public"."_unalike" (BOOLEAN, "anyelement", "text", "text") OWNER TO "postgres";

--
-- Name: add_result(boolean, boolean, "text", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."add_result" (BOOLEAN, BOOLEAN, "text", "text", "text") RETURNS INTEGER LANGUAGE "plpgsql" AS $_$
BEGIN
    IF NOT $1 THEN PERFORM _set('failed', _get('failed') + 1); END IF;
    RETURN nextval('__tresults___numb_seq');
END;
$_$;

ALTER FUNCTION "public"."add_result" (BOOLEAN, BOOLEAN, "text", "text", "text") OWNER TO "postgres";

--
-- Name: alike("anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."alike" ("anyelement", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT _alike( $1 ~~ $2, $1, $2, NULL );
$_$;

ALTER FUNCTION "public"."alike" ("anyelement", "text") OWNER TO "postgres";

--
-- Name: alike("anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."alike" ("anyelement", "text", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT _alike( $1 ~~ $2, $1, $2, $3 );
$_$;

ALTER FUNCTION "public"."alike" ("anyelement", "text", "text") OWNER TO "postgres";

--
-- Name: cmp_ok("anyelement", "text", "anyelement"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."cmp_ok" ("anyelement", "text", "anyelement") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT cmp_ok( $1, $2, $3, NULL );
$_$;

ALTER FUNCTION "public"."cmp_ok" ("anyelement", "text", "anyelement") OWNER TO "postgres";

--
-- Name: cmp_ok("anyelement", "text", "anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."cmp_ok" ("anyelement", "text", "anyelement", "text") RETURNS "text" LANGUAGE "plpgsql" AS $_$
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

ALTER FUNCTION "public"."cmp_ok" ("anyelement", "text", "anyelement", "text") OWNER TO "postgres";

--
-- Name: diag("text"[]); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."diag" (VARIADIC "text" []) RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT diag(array_to_string($1, ''));
$_$;

ALTER FUNCTION "public"."diag" (VARIADIC "text" []) OWNER TO "postgres";

--
-- Name: diag("anyarray"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."diag" (VARIADIC "anyarray") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT diag(array_to_string($1, ''));
$_$;

ALTER FUNCTION "public"."diag" (VARIADIC "anyarray") OWNER TO "postgres";

--
-- Name: diag("anyelement"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."diag" ("msg" "anyelement") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT diag($1::text);
$_$;

ALTER FUNCTION "public"."diag" ("msg" "anyelement") OWNER TO "postgres";

--
-- Name: diag("text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."diag" ("msg" "text") RETURNS "text" LANGUAGE "sql" STRICT AS $_$
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

ALTER FUNCTION "public"."diag" ("msg" "text") OWNER TO "postgres";

--
-- Name: doesnt_imatch("anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."doesnt_imatch" ("anyelement", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT _unalike( $1 !~* $2, $1, $2, NULL );
$_$;

ALTER FUNCTION "public"."doesnt_imatch" ("anyelement", "text") OWNER TO "postgres";

--
-- Name: doesnt_imatch("anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."doesnt_imatch" ("anyelement", "text", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT _unalike( $1 !~* $2, $1, $2, $3 );
$_$;

ALTER FUNCTION "public"."doesnt_imatch" ("anyelement", "text", "text") OWNER TO "postgres";

--
-- Name: doesnt_match("anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."doesnt_match" ("anyelement", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT _unalike( $1 !~ $2, $1, $2, NULL );
$_$;

ALTER FUNCTION "public"."doesnt_match" ("anyelement", "text") OWNER TO "postgres";

--
-- Name: doesnt_match("anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."doesnt_match" ("anyelement", "text", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT _unalike( $1 !~ $2, $1, $2, $3 );
$_$;

ALTER FUNCTION "public"."doesnt_match" ("anyelement", "text", "text") OWNER TO "postgres";

--
-- Name: fail(); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."fail" () RETURNS "text" LANGUAGE "sql" AS $$
    SELECT ok( FALSE, NULL );
$$;

ALTER FUNCTION "public"."fail" () OWNER TO "postgres";

--
-- Name: fail("text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."fail" ("text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT ok( FALSE, $1 );
$_$;

ALTER FUNCTION "public"."fail" ("text") OWNER TO "postgres";

--
-- Name: finish(); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."finish" () RETURNS SETOF "text" LANGUAGE "sql" AS $$
    SELECT * FROM _finish(
        _get('curr_test'),
        _get('plan'),
        num_failed()
    );
$$;

ALTER FUNCTION "public"."finish" () OWNER TO "postgres";

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."handle_new_user" () RETURNS "trigger" LANGUAGE "plpgsql" SECURITY DEFINER
SET
    "search_path" TO 'public' AS $$
begin
  insert into public.profiles (id, first_name, last_name, company_id, email)
  values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', cast(new.raw_user_meta_data ->> 'company_id' as uuid), new.email);
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user" () OWNER TO "postgres";

--
-- Name: has_relation("name"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."has_relation" ("name") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT has_relation( $1, 'Relation ' || quote_ident($1) || ' should exist' );
$_$;

ALTER FUNCTION "public"."has_relation" ("name") OWNER TO "postgres";

--
-- Name: has_relation("name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."has_relation" ("name", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT ok( _relexists( $1 ), $2 );
$_$;

ALTER FUNCTION "public"."has_relation" ("name", "text") OWNER TO "postgres";

--
-- Name: has_relation("name", "name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."has_relation" ("name", "name", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT ok( _relexists( $1, $2 ), $3 );
$_$;

ALTER FUNCTION "public"."has_relation" ("name", "name", "text") OWNER TO "postgres";

--
-- Name: has_table("name"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."has_table" ("name") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT has_table( $1, 'Table ' || quote_ident($1) || ' should exist' );
$_$;

ALTER FUNCTION "public"."has_table" ("name") OWNER TO "postgres";

--
-- Name: has_table("name", "name"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."has_table" ("name", "name") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT ok(
        _rexists( '{r,p}'::char[], $1, $2 ),
        'Table ' || quote_ident($1) || '.' || quote_ident($2) || ' should exist'
    );
$_$;

ALTER FUNCTION "public"."has_table" ("name", "name") OWNER TO "postgres";

--
-- Name: has_table("name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."has_table" ("name", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT ok( _rexists( '{r,p}'::char[], $1 ), $2 );
$_$;

ALTER FUNCTION "public"."has_table" ("name", "text") OWNER TO "postgres";

--
-- Name: has_table("name", "name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."has_table" ("name", "name", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT ok( _rexists( '{r,p}'::char[], $1, $2 ), $3 );
$_$;

ALTER FUNCTION "public"."has_table" ("name", "name", "text") OWNER TO "postgres";

--
-- Name: has_view("name"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."has_view" ("name") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT has_view( $1, 'View ' || quote_ident($1) || ' should exist' );
$_$;

ALTER FUNCTION "public"."has_view" ("name") OWNER TO "postgres";

--
-- Name: has_view("name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."has_view" ("name", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT ok( _rexists( 'v', $1 ), $2 );
$_$;

ALTER FUNCTION "public"."has_view" ("name", "text") OWNER TO "postgres";

--
-- Name: has_view("name", "name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."has_view" ("name", "name", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT ok( _rexists( 'v', $1, $2 ), $3 );
$_$;

ALTER FUNCTION "public"."has_view" ("name", "name", "text") OWNER TO "postgres";

--
-- Name: hasnt_relation("name"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."hasnt_relation" ("name") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT hasnt_relation( $1, 'Relation ' || quote_ident($1) || ' should not exist' );
$_$;

ALTER FUNCTION "public"."hasnt_relation" ("name") OWNER TO "postgres";

--
-- Name: hasnt_relation("name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."hasnt_relation" ("name", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT ok( NOT _relexists( $1 ), $2 );
$_$;

ALTER FUNCTION "public"."hasnt_relation" ("name", "text") OWNER TO "postgres";

--
-- Name: hasnt_relation("name", "name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."hasnt_relation" ("name", "name", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT ok( NOT _relexists( $1, $2 ), $3 );
$_$;

ALTER FUNCTION "public"."hasnt_relation" ("name", "name", "text") OWNER TO "postgres";

--
-- Name: hasnt_table("name"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."hasnt_table" ("name") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT hasnt_table( $1, 'Table ' || quote_ident($1) || ' should not exist' );
$_$;

ALTER FUNCTION "public"."hasnt_table" ("name") OWNER TO "postgres";

--
-- Name: hasnt_table("name", "name"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."hasnt_table" ("name", "name") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT ok(
        NOT _rexists( '{r,p}'::char[], $1, $2 ),
        'Table ' || quote_ident($1) || '.' || quote_ident($2) || ' should not exist'
    );
$_$;

ALTER FUNCTION "public"."hasnt_table" ("name", "name") OWNER TO "postgres";

--
-- Name: hasnt_table("name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."hasnt_table" ("name", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT ok( NOT _rexists( '{r,p}'::char[], $1 ), $2 );
$_$;

ALTER FUNCTION "public"."hasnt_table" ("name", "text") OWNER TO "postgres";

--
-- Name: hasnt_table("name", "name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."hasnt_table" ("name", "name", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT ok( NOT _rexists( '{r,p}'::char[], $1, $2 ), $3 );
$_$;

ALTER FUNCTION "public"."hasnt_table" ("name", "name", "text") OWNER TO "postgres";

--
-- Name: hasnt_view("name"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."hasnt_view" ("name") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT hasnt_view( $1, 'View ' || quote_ident($1) || ' should not exist' );
$_$;

ALTER FUNCTION "public"."hasnt_view" ("name") OWNER TO "postgres";

--
-- Name: hasnt_view("name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."hasnt_view" ("name", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT ok( NOT _rexists( 'v', $1 ), $2 );
$_$;

ALTER FUNCTION "public"."hasnt_view" ("name", "text") OWNER TO "postgres";

--
-- Name: hasnt_view("name", "name", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."hasnt_view" ("name", "name", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT ok( NOT _rexists( 'v', $1, $2 ), $3 );
$_$;

ALTER FUNCTION "public"."hasnt_view" ("name", "name", "text") OWNER TO "postgres";

--
-- Name: ialike("anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."ialike" ("anyelement", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT _alike( $1 ~~* $2, $1, $2, NULL );
$_$;

ALTER FUNCTION "public"."ialike" ("anyelement", "text") OWNER TO "postgres";

--
-- Name: ialike("anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."ialike" ("anyelement", "text", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT _alike( $1 ~~* $2, $1, $2, $3 );
$_$;

ALTER FUNCTION "public"."ialike" ("anyelement", "text", "text") OWNER TO "postgres";

--
-- Name: imatches("anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."imatches" ("anyelement", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT _alike( $1 ~* $2, $1, $2, NULL );
$_$;

ALTER FUNCTION "public"."imatches" ("anyelement", "text") OWNER TO "postgres";

--
-- Name: imatches("anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."imatches" ("anyelement", "text", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT _alike( $1 ~* $2, $1, $2, $3 );
$_$;

ALTER FUNCTION "public"."imatches" ("anyelement", "text", "text") OWNER TO "postgres";

--
-- Name: in_todo(); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."in_todo" () RETURNS BOOLEAN LANGUAGE "plpgsql" AS $$
DECLARE
    todos integer;
BEGIN
    todos := _get('todo');
    RETURN CASE WHEN todos IS NULL THEN FALSE ELSE TRUE END;
END;
$$;

ALTER FUNCTION "public"."in_todo" () OWNER TO "postgres";

--
-- Name: is("anyelement", "anyelement"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."is" ("anyelement", "anyelement") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT is( $1, $2, NULL);
$_$;

ALTER FUNCTION "public"."is" ("anyelement", "anyelement") OWNER TO "postgres";

--
-- Name: is("anyelement", "anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."is" ("anyelement", "anyelement", "text") RETURNS "text" LANGUAGE "plpgsql" AS $_$
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

ALTER FUNCTION "public"."is" ("anyelement", "anyelement", "text") OWNER TO "postgres";

--
-- Name: isnt("anyelement", "anyelement"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."isnt" ("anyelement", "anyelement") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT isnt( $1, $2, NULL);
$_$;

ALTER FUNCTION "public"."isnt" ("anyelement", "anyelement") OWNER TO "postgres";

--
-- Name: isnt("anyelement", "anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."isnt" ("anyelement", "anyelement", "text") RETURNS "text" LANGUAGE "plpgsql" AS $_$
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

ALTER FUNCTION "public"."isnt" ("anyelement", "anyelement", "text") OWNER TO "postgres";

--
-- Name: lives_ok("text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."lives_ok" ("text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT lives_ok( $1, NULL );
$_$;

ALTER FUNCTION "public"."lives_ok" ("text") OWNER TO "postgres";

--
-- Name: lives_ok("text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."lives_ok" ("text", "text") RETURNS "text" LANGUAGE "plpgsql" AS $_$
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

ALTER FUNCTION "public"."lives_ok" ("text", "text") OWNER TO "postgres";

--
-- Name: matches("anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."matches" ("anyelement", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT _alike( $1 ~ $2, $1, $2, NULL );
$_$;

ALTER FUNCTION "public"."matches" ("anyelement", "text") OWNER TO "postgres";

--
-- Name: matches("anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."matches" ("anyelement", "text", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT _alike( $1 ~ $2, $1, $2, $3 );
$_$;

ALTER FUNCTION "public"."matches" ("anyelement", "text", "text") OWNER TO "postgres";

--
-- Name: no_plan(); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."no_plan" () RETURNS SETOF BOOLEAN LANGUAGE "plpgsql" STRICT AS $$
BEGIN
    PERFORM plan(0);
    RETURN;
END;
$$;

ALTER FUNCTION "public"."no_plan" () OWNER TO "postgres";

--
-- Name: num_failed(); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."num_failed" () RETURNS INTEGER LANGUAGE "sql" STRICT AS $$
    SELECT _get('failed');
$$;

ALTER FUNCTION "public"."num_failed" () OWNER TO "postgres";

--
-- Name: ok(boolean); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."ok" (BOOLEAN) RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT ok( $1, NULL );
$_$;

ALTER FUNCTION "public"."ok" (BOOLEAN) OWNER TO "postgres";

--
-- Name: ok(boolean, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."ok" (BOOLEAN, "text") RETURNS "text" LANGUAGE "plpgsql" AS $_$
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

ALTER FUNCTION "public"."ok" (BOOLEAN, "text") OWNER TO "postgres";

--
-- Name: os_name(); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."os_name" () RETURNS "text" LANGUAGE "sql" IMMUTABLE AS $$SELECT 'linux'::text;$$;

ALTER FUNCTION "public"."os_name" () OWNER TO "postgres";

--
-- Name: pass(); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."pass" () RETURNS "text" LANGUAGE "sql" AS $$
    SELECT ok( TRUE, NULL );
$$;

ALTER FUNCTION "public"."pass" () OWNER TO "postgres";

--
-- Name: pass("text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."pass" ("text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT ok( TRUE, $1 );
$_$;

ALTER FUNCTION "public"."pass" ("text") OWNER TO "postgres";

--
-- Name: performs_ok("text", numeric); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."performs_ok" ("text", NUMERIC) RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT performs_ok(
        $1, $2, 'Should run in less than ' || $2 || ' ms'
    );
$_$;

ALTER FUNCTION "public"."performs_ok" ("text", NUMERIC) OWNER TO "postgres";

--
-- Name: performs_ok("text", numeric, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."performs_ok" ("text", NUMERIC, "text") RETURNS "text" LANGUAGE "plpgsql" AS $_$
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

ALTER FUNCTION "public"."performs_ok" ("text", NUMERIC, "text") OWNER TO "postgres";

--
-- Name: performs_within("text", numeric, numeric); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC) RETURNS "text" LANGUAGE "sql" AS $_$
SELECT performs_within(
          $1, $2, $3, 10,
          'Should run within ' || $2 || ' +/- ' || $3 || ' ms');
$_$;

ALTER FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC) OWNER TO "postgres";

--
-- Name: performs_within("text", numeric, numeric, integer); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC, INTEGER) RETURNS "text" LANGUAGE "sql" AS $_$
SELECT performs_within(
          $1, $2, $3, $4,
          'Should run within ' || $2 || ' +/- ' || $3 || ' ms');
$_$;

ALTER FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC, INTEGER) OWNER TO "postgres";

--
-- Name: performs_within("text", numeric, numeric, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC, "text") RETURNS "text" LANGUAGE "sql" AS $_$
SELECT performs_within(
          $1, $2, $3, 10, $4
        );
$_$;

ALTER FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC, "text") OWNER TO "postgres";

--
-- Name: performs_within("text", numeric, numeric, integer, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC, INTEGER, "text") RETURNS "text" LANGUAGE "plpgsql" AS $_$
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

ALTER FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC, INTEGER, "text") OWNER TO "postgres";

--
-- Name: pg_version(); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."pg_version" () RETURNS "text" LANGUAGE "sql" IMMUTABLE AS $$SELECT current_setting('server_version')$$;

ALTER FUNCTION "public"."pg_version" () OWNER TO "postgres";

--
-- Name: pg_version_num(); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."pg_version_num" () RETURNS INTEGER LANGUAGE "sql" IMMUTABLE AS $$
    SELECT current_setting('server_version_num')::integer;
$$;

ALTER FUNCTION "public"."pg_version_num" () OWNER TO "postgres";

--
-- Name: pgtap_version(); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."pgtap_version" () RETURNS NUMERIC LANGUAGE "sql" IMMUTABLE AS $$SELECT 1.0;$$;

ALTER FUNCTION "public"."pgtap_version" () OWNER TO "postgres";

--
-- Name: plan(integer); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."plan" (INTEGER) RETURNS "text" LANGUAGE "plpgsql" STRICT AS $_$
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

ALTER FUNCTION "public"."plan" (INTEGER) OWNER TO "postgres";

--
-- Name: skip(integer); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."skip" (INTEGER) RETURNS "text" LANGUAGE "sql" AS $_$SELECT skip(NULL, $1)$_$;

ALTER FUNCTION "public"."skip" (INTEGER) OWNER TO "postgres";

--
-- Name: skip("text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."skip" ("text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT ok( TRUE ) || ' ' || diag( 'SKIP' || COALESCE(' ' || $1, '') );
$_$;

ALTER FUNCTION "public"."skip" ("text") OWNER TO "postgres";

--
-- Name: skip(integer, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."skip" (INTEGER, "text") RETURNS "text" LANGUAGE "sql" AS $_$SELECT skip($2, $1)$_$;

ALTER FUNCTION "public"."skip" (INTEGER, "text") OWNER TO "postgres";

--
-- Name: skip("text", integer); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."skip" ("why" "text", "how_many" INTEGER) RETURNS "text" LANGUAGE "plpgsql" AS $$
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

ALTER FUNCTION "public"."skip" ("why" "text", "how_many" INTEGER) OWNER TO "postgres";

--
-- Name: throws_ok("text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."throws_ok" ("text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT throws_ok( $1, NULL, NULL, NULL );
$_$;

ALTER FUNCTION "public"."throws_ok" ("text") OWNER TO "postgres";

--
-- Name: throws_ok("text", integer); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."throws_ok" ("text", INTEGER) RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT throws_ok( $1, $2::char(5), NULL, NULL );
$_$;

ALTER FUNCTION "public"."throws_ok" ("text", INTEGER) OWNER TO "postgres";

--
-- Name: throws_ok("text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."throws_ok" ("text", "text") RETURNS "text" LANGUAGE "plpgsql" AS $_$
BEGIN
    IF octet_length($2) = 5 THEN
        RETURN throws_ok( $1, $2::char(5), NULL, NULL );
    ELSE
        RETURN throws_ok( $1, NULL, $2, NULL );
    END IF;
END;
$_$;

ALTER FUNCTION "public"."throws_ok" ("text", "text") OWNER TO "postgres";

--
-- Name: throws_ok("text", integer, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."throws_ok" ("text", INTEGER, "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT throws_ok( $1, $2::char(5), $3, NULL );
$_$;

ALTER FUNCTION "public"."throws_ok" ("text", INTEGER, "text") OWNER TO "postgres";

--
-- Name: throws_ok("text", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."throws_ok" ("text", "text", "text") RETURNS "text" LANGUAGE "plpgsql" AS $_$
BEGIN
    IF octet_length($2) = 5 THEN
        RETURN throws_ok( $1, $2::char(5), $3, NULL );
    ELSE
        RETURN throws_ok( $1, NULL, $2, $3 );
    END IF;
END;
$_$;

ALTER FUNCTION "public"."throws_ok" ("text", "text", "text") OWNER TO "postgres";

--
-- Name: throws_ok("text", character, "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."throws_ok" ("text", CHARACTER, "text", "text") RETURNS "text" LANGUAGE "plpgsql" AS $_$
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

ALTER FUNCTION "public"."throws_ok" ("text", CHARACTER, "text", "text") OWNER TO "postgres";

--
-- Name: throws_ok("text", integer, "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."throws_ok" ("text", INTEGER, "text", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT throws_ok( $1, $2::char(5), $3, $4 );
$_$;

ALTER FUNCTION "public"."throws_ok" ("text", INTEGER, "text", "text") OWNER TO "postgres";

--
-- Name: todo(integer); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."todo" ("how_many" INTEGER) RETURNS SETOF BOOLEAN LANGUAGE "plpgsql" AS $$
BEGIN
    PERFORM _add('todo', COALESCE(how_many, 1), '');
    RETURN;
END;
$$;

ALTER FUNCTION "public"."todo" ("how_many" INTEGER) OWNER TO "postgres";

--
-- Name: todo("text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."todo" ("why" "text") RETURNS SETOF BOOLEAN LANGUAGE "plpgsql" AS $$
BEGIN
    PERFORM _add('todo', 1, COALESCE(why, ''));
    RETURN;
END;
$$;

ALTER FUNCTION "public"."todo" ("why" "text") OWNER TO "postgres";

--
-- Name: todo(integer, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."todo" ("how_many" INTEGER, "why" "text") RETURNS SETOF BOOLEAN LANGUAGE "plpgsql" AS $$
BEGIN
    PERFORM _add('todo', COALESCE(how_many, 1), COALESCE(why, ''));
    RETURN;
END;
$$;

ALTER FUNCTION "public"."todo" ("how_many" INTEGER, "why" "text") OWNER TO "postgres";

--
-- Name: todo("text", integer); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."todo" ("why" "text", "how_many" INTEGER) RETURNS SETOF BOOLEAN LANGUAGE "plpgsql" AS $$
BEGIN
    PERFORM _add('todo', COALESCE(how_many, 1), COALESCE(why, ''));
    RETURN;
END;
$$;

ALTER FUNCTION "public"."todo" ("why" "text", "how_many" INTEGER) OWNER TO "postgres";

--
-- Name: todo_end(); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."todo_end" () RETURNS SETOF BOOLEAN LANGUAGE "plpgsql" AS $$
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

ALTER FUNCTION "public"."todo_end" () OWNER TO "postgres";

--
-- Name: todo_start(); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."todo_start" () RETURNS SETOF BOOLEAN LANGUAGE "plpgsql" AS $$
BEGIN
    PERFORM _add('todo', -1, '');
    RETURN;
END;
$$;

ALTER FUNCTION "public"."todo_start" () OWNER TO "postgres";

--
-- Name: todo_start("text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."todo_start" ("text") RETURNS SETOF BOOLEAN LANGUAGE "plpgsql" AS $_$
BEGIN
    PERFORM _add('todo', -1, COALESCE($1, ''));
    RETURN;
END;
$_$;

ALTER FUNCTION "public"."todo_start" ("text") OWNER TO "postgres";

--
-- Name: truncate_all_tables(); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."truncate_all_tables" () RETURNS "void" LANGUAGE "plpgsql" AS $$
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

ALTER FUNCTION "public"."truncate_all_tables" () OWNER TO "postgres";

--
-- Name: truncate_all_tables("text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."truncate_all_tables" ("schema_name" "text") RETURNS "void" LANGUAGE "plpgsql" SECURITY DEFINER AS $$
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

ALTER FUNCTION "public"."truncate_all_tables" ("schema_name" "text") OWNER TO "postgres";

--
-- Name: unalike("anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."unalike" ("anyelement", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT _unalike( $1 !~~ $2, $1, $2, NULL );
$_$;

ALTER FUNCTION "public"."unalike" ("anyelement", "text") OWNER TO "postgres";

--
-- Name: unalike("anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."unalike" ("anyelement", "text", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT _unalike( $1 !~~ $2, $1, $2, $3 );
$_$;

ALTER FUNCTION "public"."unalike" ("anyelement", "text", "text") OWNER TO "postgres";

--
-- Name: unialike("anyelement", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."unialike" ("anyelement", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT _unalike( $1 !~~* $2, $1, $2, NULL );
$_$;

ALTER FUNCTION "public"."unialike" ("anyelement", "text") OWNER TO "postgres";

--
-- Name: unialike("anyelement", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION "public"."unialike" ("anyelement", "text", "text") RETURNS "text" LANGUAGE "sql" AS $_$
    SELECT _unalike( $1 !~~* $2, $1, $2, $3 );
$_$;

ALTER FUNCTION "public"."unialike" ("anyelement", "text", "text") OWNER TO "postgres";

SET
    default_tablespace = '';

SET
    default_table_access_method = "heap";

--
-- Name: campaign_creators; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE
    "public"."campaign_creators" (
        "id" "uuid" DEFAULT "extensions"."uuid_generate_v4" () NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT "now" (),
        "status" "text",
        "campaign_id" "uuid",
        "updated_at" TIMESTAMP WITH TIME ZONE,
        "relay_creator_id" BIGINT,
        "creator_model" "text",
        "creator_token" "text",
        "interested" BOOLEAN,
        "email_sent" BOOLEAN,
        "publication_date" TIMESTAMP WITH TIME ZONE,
        "rate_cents" BIGINT DEFAULT '0'::BIGINT NOT NULL,
        "rate_currency" "text" DEFAULT 'USD'::"text" NOT NULL,
        "payment_details" "text",
        "payment_status" "text" DEFAULT '''unpaid''::text'::"text" NOT NULL,
        "paid_amount_cents" BIGINT DEFAULT '0'::BIGINT NOT NULL,
        "paid_amount_currency" "text" DEFAULT 'USD'::"text" NOT NULL,
        "address" "text",
        "sample_status" "text" DEFAULT '''unsent''::text'::"text" NOT NULL,
        "tracking_details" "text",
        "reject_message" "text",
        "brief_opened_by_creator" BOOLEAN,
        "need_support" BOOLEAN,
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
CREATE TABLE
    "public"."campaign_notes" (
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT "now" (),
        "comment" "text",
        "user_id" "uuid" NOT NULL,
        "campaign_creator_id" "uuid" NOT NULL,
        "important" BOOLEAN DEFAULT FALSE NOT NULL,
        "id" "uuid" DEFAULT "extensions"."uuid_generate_v4" () NOT NULL
    );

ALTER TABLE "public"."campaign_notes" OWNER TO "postgres";

--
-- Name: campaigns; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE
    "public"."campaigns" (
        "id" "uuid" DEFAULT "extensions"."uuid_generate_v4" () NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT "now" (),
        "name" "text" NOT NULL,
        "description" "text" NOT NULL,
        "company_id" "uuid" NOT NULL,
        "product_link" "text",
        "status" "text",
        "budget_cents" BIGINT,
        "budget_currency" "text",
        "creator_count" SMALLINT,
        "date_end_creator_outreach" TIMESTAMP WITH TIME ZONE,
        "date_start_campaign" TIMESTAMP WITH TIME ZONE DEFAULT ("now" () AT TIME ZONE 'utc'::"text"),
        "date_end_campaign" TIMESTAMP WITH TIME ZONE DEFAULT ("now" () AT TIME ZONE 'utc'::"text"),
        "slug" "text",
        "product_name" "text",
        "requirements" "text",
        "tag_list" "text" [],
        "promo_types" "text" [],
        "target_locations" "text" [],
        "media" "json" [],
        "purge_media" "json" [],
        "media_path" "text" []
    );

ALTER TABLE "public"."campaigns" OWNER TO "postgres";

--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE
    "public"."companies" (
        "id" "uuid" DEFAULT "extensions"."uuid_generate_v4" () NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT "now" (),
        "name" "text",
        "website" "text",
        "avatar_url" "text",
        "updated_at" TIMESTAMP WITH TIME ZONE,
        "cus_id" "text",
        "searches_limit" "text" DEFAULT ''::"text" NOT NULL,
        "profiles_limit" "text" DEFAULT ''::"text" NOT NULL,
        "subscription_status" "text" DEFAULT ''::"text" NOT NULL,
        "trial_searches_limit" "text" DEFAULT ''::"text" NOT NULL,
        "trial_profiles_limit" "text" DEFAULT ''::"text" NOT NULL,
        "subscription_start_date" TIMESTAMP WITH TIME ZONE,
        "subscription_end_date" "text",
        "subscription_current_period_end" TIMESTAMP WITH TIME ZONE,
        "subscription_current_period_start" TIMESTAMP WITH TIME ZONE,
        "ai_email_generator_limit" "text" DEFAULT '1000'::"text" NOT NULL,
        "trial_ai_email_generator_limit" "text" DEFAULT '10'::"text" NOT NULL
    );

ALTER TABLE "public"."companies" OWNER TO "postgres";

--
-- Name: invites; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE
    "public"."invites" (
        "id" "uuid" DEFAULT "extensions"."uuid_generate_v4" () NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT "now" (),
        "company_id" "uuid" NOT NULL,
        "email" "text" NOT NULL,
        "used" BOOLEAN DEFAULT FALSE NOT NULL,
        "expire_at" TIMESTAMP WITH TIME ZONE DEFAULT ("now" () + '30 days'::INTERVAL),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT "now" (),
        "company_owner" BOOLEAN DEFAULT FALSE
    );

ALTER TABLE "public"."invites" OWNER TO "postgres";

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE
    "public"."profiles" (
        "id" "uuid" NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE,
        "avatar_url" "text",
        "phone" "text",
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT "now" (),
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
CREATE TABLE
    "public"."usages" (
        "id" "uuid" DEFAULT "extensions"."uuid_generate_v4" () NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT "now" (),
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
ADD CONSTRAINT "campaign_creators_added_by_id_fkey" FOREIGN KEY ("added_by_id") REFERENCES "public"."profiles" ("id");

--
-- Name: campaign_creators campaign_creators_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY "public"."campaign_creators"
ADD CONSTRAINT "campaign_creators_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns" ("id");

--
-- Name: campaign_notes campaign_notes_campaign_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY "public"."campaign_notes"
ADD CONSTRAINT "campaign_notes_campaign_creator_id_fkey" FOREIGN KEY ("campaign_creator_id") REFERENCES "public"."campaign_creators" ("id");

--
-- Name: campaign_notes campaign_notes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY "public"."campaign_notes"
ADD CONSTRAINT "campaign_notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id");

--
-- Name: campaigns campaigns_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY "public"."campaigns"
ADD CONSTRAINT "campaigns_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies" ("id");

--
-- Name: invites invites_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY "public"."invites"
ADD CONSTRAINT "invites_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies" ("id");

--
-- Name: profiles profiles_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY "public"."profiles"
ADD CONSTRAINT "profiles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies" ("id");

--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY "public"."profiles"
ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users" ("id");

--
-- Name: usages usages_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY "public"."usages"
ADD CONSTRAINT "usages_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies" ("id");

--
-- Name: campaigns Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY "Enable insert for authenticated users only" ON "public"."campaigns" FOR INSERT TO "authenticated"
WITH
    CHECK (TRUE);

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles profiles_policy; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY "profiles_policy" ON "public"."profiles" USING (
    (
        ("id" = "auth"."uid" ())
        OR (
            (
                SELECT
                    "profiles_1"."user_role"
                FROM
                    "public"."profiles" "profiles_1"
                WHERE
                    ("profiles_1"."id" = "auth"."uid" ())
            ) = 'relay_employee'::"text"
        )
    )
)
WITH
    CHECK (
        (
            (
                (
                    SELECT
                        "profiles_1"."user_role"
                    FROM
                        "public"."profiles" "profiles_1"
                    WHERE
                        ("profiles_1"."id" = "auth"."uid" ())
                ) = "user_role"
            )
            AND (
                (
                    SELECT
                        "profiles_1"."company_id"
                    FROM
                        "public"."profiles" "profiles_1"
                    WHERE
                        ("profiles_1"."id" = "auth"."uid" ())
                ) = "company_id"
            )
        )
    );

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
REVOKE USAGE ON SCHEMA "public"
FROM
    PUBLIC;

GRANT USAGE ON SCHEMA "public" TO "anon";

GRANT USAGE ON SCHEMA "public" TO "authenticated";

GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON SCHEMA "public" TO PUBLIC;

--
-- Name: FUNCTION "_add"("text", integer); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_add" ("text", INTEGER) TO "anon";

GRANT ALL ON FUNCTION "public"."_add" ("text", INTEGER) TO "authenticated";

GRANT ALL ON FUNCTION "public"."_add" ("text", INTEGER) TO "service_role";

--
-- Name: FUNCTION "_add"("text", integer, "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_add" ("text", INTEGER, "text") TO "anon";

GRANT ALL ON FUNCTION "public"."_add" ("text", INTEGER, "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."_add" ("text", INTEGER, "text") TO "service_role";

--
-- Name: FUNCTION "_alike"(boolean, "anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_alike" (BOOLEAN, "anyelement", "text", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."_alike" (BOOLEAN, "anyelement", "text", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."_alike" (BOOLEAN, "anyelement", "text", "text") TO "service_role";

--
-- Name: FUNCTION "_error_diag"("text", "text", "text", "text", "text", "text", "text", "text", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_error_diag" (
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text"
) TO "anon";

GRANT ALL ON FUNCTION "public"."_error_diag" (
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text"
) TO "authenticated";

GRANT ALL ON FUNCTION "public"."_error_diag" (
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text"
) TO "service_role";

--
-- Name: FUNCTION "_finish"(integer, integer, integer); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_finish" (INTEGER, INTEGER, INTEGER) TO "anon";

GRANT ALL ON FUNCTION "public"."_finish" (INTEGER, INTEGER, INTEGER) TO "authenticated";

GRANT ALL ON FUNCTION "public"."_finish" (INTEGER, INTEGER, INTEGER) TO "service_role";

--
-- Name: FUNCTION "_get"("text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_get" ("text") TO "anon";

GRANT ALL ON FUNCTION "public"."_get" ("text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."_get" ("text") TO "service_role";

--
-- Name: FUNCTION "_get_latest"("text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_get_latest" ("text") TO "anon";

GRANT ALL ON FUNCTION "public"."_get_latest" ("text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."_get_latest" ("text") TO "service_role";

--
-- Name: FUNCTION "_get_latest"("text", integer); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_get_latest" ("text", INTEGER) TO "anon";

GRANT ALL ON FUNCTION "public"."_get_latest" ("text", INTEGER) TO "authenticated";

GRANT ALL ON FUNCTION "public"."_get_latest" ("text", INTEGER) TO "service_role";

--
-- Name: FUNCTION "_get_note"(integer); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_get_note" (INTEGER) TO "anon";

GRANT ALL ON FUNCTION "public"."_get_note" (INTEGER) TO "authenticated";

GRANT ALL ON FUNCTION "public"."_get_note" (INTEGER) TO "service_role";

--
-- Name: FUNCTION "_get_note"("text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_get_note" ("text") TO "anon";

GRANT ALL ON FUNCTION "public"."_get_note" ("text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."_get_note" ("text") TO "service_role";

--
-- Name: FUNCTION "_query"("text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_query" ("text") TO "anon";

GRANT ALL ON FUNCTION "public"."_query" ("text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."_query" ("text") TO "service_role";

--
-- Name: FUNCTION "_relexists"("name"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_relexists" ("name") TO "anon";

GRANT ALL ON FUNCTION "public"."_relexists" ("name") TO "authenticated";

GRANT ALL ON FUNCTION "public"."_relexists" ("name") TO "service_role";

--
-- Name: FUNCTION "_relexists"("name", "name"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_relexists" ("name", "name") TO "anon";

GRANT ALL ON FUNCTION "public"."_relexists" ("name", "name") TO "authenticated";

GRANT ALL ON FUNCTION "public"."_relexists" ("name", "name") TO "service_role";

--
-- Name: FUNCTION "_rexists"(character[], "name"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_rexists" (CHARACTER[], "name") TO "anon";

GRANT ALL ON FUNCTION "public"."_rexists" (CHARACTER[], "name") TO "authenticated";

GRANT ALL ON FUNCTION "public"."_rexists" (CHARACTER[], "name") TO "service_role";

--
-- Name: FUNCTION "_rexists"(character, "name"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_rexists" (CHARACTER, "name") TO "anon";

GRANT ALL ON FUNCTION "public"."_rexists" (CHARACTER, "name") TO "authenticated";

GRANT ALL ON FUNCTION "public"."_rexists" (CHARACTER, "name") TO "service_role";

--
-- Name: FUNCTION "_rexists"(character[], "name", "name"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_rexists" (CHARACTER[], "name", "name") TO "anon";

GRANT ALL ON FUNCTION "public"."_rexists" (CHARACTER[], "name", "name") TO "authenticated";

GRANT ALL ON FUNCTION "public"."_rexists" (CHARACTER[], "name", "name") TO "service_role";

--
-- Name: FUNCTION "_rexists"(character, "name", "name"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_rexists" (CHARACTER, "name", "name") TO "anon";

GRANT ALL ON FUNCTION "public"."_rexists" (CHARACTER, "name", "name") TO "authenticated";

GRANT ALL ON FUNCTION "public"."_rexists" (CHARACTER, "name", "name") TO "service_role";

--
-- Name: FUNCTION "_set"(integer, integer); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_set" (INTEGER, INTEGER) TO "anon";

GRANT ALL ON FUNCTION "public"."_set" (INTEGER, INTEGER) TO "authenticated";

GRANT ALL ON FUNCTION "public"."_set" (INTEGER, INTEGER) TO "service_role";

--
-- Name: FUNCTION "_set"("text", integer); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_set" ("text", INTEGER) TO "anon";

GRANT ALL ON FUNCTION "public"."_set" ("text", INTEGER) TO "authenticated";

GRANT ALL ON FUNCTION "public"."_set" ("text", INTEGER) TO "service_role";

--
-- Name: FUNCTION "_set"("text", integer, "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_set" ("text", INTEGER, "text") TO "anon";

GRANT ALL ON FUNCTION "public"."_set" ("text", INTEGER, "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."_set" ("text", INTEGER, "text") TO "service_role";

--
-- Name: FUNCTION "_time_trials"("text", integer, numeric); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_time_trials" ("text", INTEGER, NUMERIC) TO "anon";

GRANT ALL ON FUNCTION "public"."_time_trials" ("text", INTEGER, NUMERIC) TO "authenticated";

GRANT ALL ON FUNCTION "public"."_time_trials" ("text", INTEGER, NUMERIC) TO "service_role";

--
-- Name: FUNCTION "_todo"(); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_todo" () TO "anon";

GRANT ALL ON FUNCTION "public"."_todo" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."_todo" () TO "service_role";

--
-- Name: FUNCTION "_unalike"(boolean, "anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."_unalike" (BOOLEAN, "anyelement", "text", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."_unalike" (BOOLEAN, "anyelement", "text", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."_unalike" (BOOLEAN, "anyelement", "text", "text") TO "service_role";

--
-- Name: FUNCTION "add_result"(boolean, boolean, "text", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."add_result" (BOOLEAN, BOOLEAN, "text", "text", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."add_result" (BOOLEAN, BOOLEAN, "text", "text", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."add_result" (BOOLEAN, BOOLEAN, "text", "text", "text") TO "service_role";

--
-- Name: FUNCTION "alike"("anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."alike" ("anyelement", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."alike" ("anyelement", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."alike" ("anyelement", "text") TO "service_role";

--
-- Name: FUNCTION "alike"("anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."alike" ("anyelement", "text", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."alike" ("anyelement", "text", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."alike" ("anyelement", "text", "text") TO "service_role";

--
-- Name: FUNCTION "cmp_ok"("anyelement", "text", "anyelement"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."cmp_ok" ("anyelement", "text", "anyelement") TO "anon";

GRANT ALL ON FUNCTION "public"."cmp_ok" ("anyelement", "text", "anyelement") TO "authenticated";

GRANT ALL ON FUNCTION "public"."cmp_ok" ("anyelement", "text", "anyelement") TO "service_role";

--
-- Name: FUNCTION "cmp_ok"("anyelement", "text", "anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."cmp_ok" ("anyelement", "text", "anyelement", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."cmp_ok" ("anyelement", "text", "anyelement", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."cmp_ok" ("anyelement", "text", "anyelement", "text") TO "service_role";

--
-- Name: FUNCTION "diag"(VARIADIC "text"[]); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."diag" (VARIADIC "text" []) TO "anon";

GRANT ALL ON FUNCTION "public"."diag" (VARIADIC "text" []) TO "authenticated";

GRANT ALL ON FUNCTION "public"."diag" (VARIADIC "text" []) TO "service_role";

--
-- Name: FUNCTION "diag"(VARIADIC "anyarray"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."diag" (VARIADIC "anyarray") TO "anon";

GRANT ALL ON FUNCTION "public"."diag" (VARIADIC "anyarray") TO "authenticated";

GRANT ALL ON FUNCTION "public"."diag" (VARIADIC "anyarray") TO "service_role";

--
-- Name: FUNCTION "diag"("msg" "anyelement"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."diag" ("msg" "anyelement") TO "anon";

GRANT ALL ON FUNCTION "public"."diag" ("msg" "anyelement") TO "authenticated";

GRANT ALL ON FUNCTION "public"."diag" ("msg" "anyelement") TO "service_role";

--
-- Name: FUNCTION "diag"("msg" "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."diag" ("msg" "text") TO "anon";

GRANT ALL ON FUNCTION "public"."diag" ("msg" "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."diag" ("msg" "text") TO "service_role";

--
-- Name: FUNCTION "doesnt_imatch"("anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."doesnt_imatch" ("anyelement", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."doesnt_imatch" ("anyelement", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."doesnt_imatch" ("anyelement", "text") TO "service_role";

--
-- Name: FUNCTION "doesnt_imatch"("anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."doesnt_imatch" ("anyelement", "text", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."doesnt_imatch" ("anyelement", "text", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."doesnt_imatch" ("anyelement", "text", "text") TO "service_role";

--
-- Name: FUNCTION "doesnt_match"("anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."doesnt_match" ("anyelement", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."doesnt_match" ("anyelement", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."doesnt_match" ("anyelement", "text") TO "service_role";

--
-- Name: FUNCTION "doesnt_match"("anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."doesnt_match" ("anyelement", "text", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."doesnt_match" ("anyelement", "text", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."doesnt_match" ("anyelement", "text", "text") TO "service_role";

--
-- Name: FUNCTION "fail"(); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."fail" () TO "anon";

GRANT ALL ON FUNCTION "public"."fail" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."fail" () TO "service_role";

--
-- Name: FUNCTION "fail"("text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."fail" ("text") TO "anon";

GRANT ALL ON FUNCTION "public"."fail" ("text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."fail" ("text") TO "service_role";

--
-- Name: FUNCTION "finish"(); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."finish" () TO "anon";

GRANT ALL ON FUNCTION "public"."finish" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."finish" () TO "service_role";

--
-- Name: FUNCTION "handle_new_user"(); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."handle_new_user" () TO "anon";

GRANT ALL ON FUNCTION "public"."handle_new_user" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."handle_new_user" () TO "service_role";

--
-- Name: FUNCTION "has_relation"("name"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."has_relation" ("name") TO "anon";

GRANT ALL ON FUNCTION "public"."has_relation" ("name") TO "authenticated";

GRANT ALL ON FUNCTION "public"."has_relation" ("name") TO "service_role";

--
-- Name: FUNCTION "has_relation"("name", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."has_relation" ("name", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."has_relation" ("name", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."has_relation" ("name", "text") TO "service_role";

--
-- Name: FUNCTION "has_relation"("name", "name", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."has_relation" ("name", "name", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."has_relation" ("name", "name", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."has_relation" ("name", "name", "text") TO "service_role";

--
-- Name: FUNCTION "has_table"("name"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."has_table" ("name") TO "anon";

GRANT ALL ON FUNCTION "public"."has_table" ("name") TO "authenticated";

GRANT ALL ON FUNCTION "public"."has_table" ("name") TO "service_role";

--
-- Name: FUNCTION "has_table"("name", "name"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."has_table" ("name", "name") TO "anon";

GRANT ALL ON FUNCTION "public"."has_table" ("name", "name") TO "authenticated";

GRANT ALL ON FUNCTION "public"."has_table" ("name", "name") TO "service_role";

--
-- Name: FUNCTION "has_table"("name", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."has_table" ("name", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."has_table" ("name", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."has_table" ("name", "text") TO "service_role";

--
-- Name: FUNCTION "has_table"("name", "name", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."has_table" ("name", "name", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."has_table" ("name", "name", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."has_table" ("name", "name", "text") TO "service_role";

--
-- Name: FUNCTION "has_view"("name"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."has_view" ("name") TO "anon";

GRANT ALL ON FUNCTION "public"."has_view" ("name") TO "authenticated";

GRANT ALL ON FUNCTION "public"."has_view" ("name") TO "service_role";

--
-- Name: FUNCTION "has_view"("name", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."has_view" ("name", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."has_view" ("name", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."has_view" ("name", "text") TO "service_role";

--
-- Name: FUNCTION "has_view"("name", "name", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."has_view" ("name", "name", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."has_view" ("name", "name", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."has_view" ("name", "name", "text") TO "service_role";

--
-- Name: FUNCTION "hasnt_relation"("name"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."hasnt_relation" ("name") TO "anon";

GRANT ALL ON FUNCTION "public"."hasnt_relation" ("name") TO "authenticated";

GRANT ALL ON FUNCTION "public"."hasnt_relation" ("name") TO "service_role";

--
-- Name: FUNCTION "hasnt_relation"("name", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."hasnt_relation" ("name", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."hasnt_relation" ("name", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."hasnt_relation" ("name", "text") TO "service_role";

--
-- Name: FUNCTION "hasnt_relation"("name", "name", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."hasnt_relation" ("name", "name", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."hasnt_relation" ("name", "name", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."hasnt_relation" ("name", "name", "text") TO "service_role";

--
-- Name: FUNCTION "hasnt_table"("name"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."hasnt_table" ("name") TO "anon";

GRANT ALL ON FUNCTION "public"."hasnt_table" ("name") TO "authenticated";

GRANT ALL ON FUNCTION "public"."hasnt_table" ("name") TO "service_role";

--
-- Name: FUNCTION "hasnt_table"("name", "name"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."hasnt_table" ("name", "name") TO "anon";

GRANT ALL ON FUNCTION "public"."hasnt_table" ("name", "name") TO "authenticated";

GRANT ALL ON FUNCTION "public"."hasnt_table" ("name", "name") TO "service_role";

--
-- Name: FUNCTION "hasnt_table"("name", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."hasnt_table" ("name", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."hasnt_table" ("name", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."hasnt_table" ("name", "text") TO "service_role";

--
-- Name: FUNCTION "hasnt_table"("name", "name", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."hasnt_table" ("name", "name", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."hasnt_table" ("name", "name", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."hasnt_table" ("name", "name", "text") TO "service_role";

--
-- Name: FUNCTION "hasnt_view"("name"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."hasnt_view" ("name") TO "anon";

GRANT ALL ON FUNCTION "public"."hasnt_view" ("name") TO "authenticated";

GRANT ALL ON FUNCTION "public"."hasnt_view" ("name") TO "service_role";

--
-- Name: FUNCTION "hasnt_view"("name", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."hasnt_view" ("name", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."hasnt_view" ("name", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."hasnt_view" ("name", "text") TO "service_role";

--
-- Name: FUNCTION "hasnt_view"("name", "name", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."hasnt_view" ("name", "name", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."hasnt_view" ("name", "name", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."hasnt_view" ("name", "name", "text") TO "service_role";

--
-- Name: FUNCTION "ialike"("anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."ialike" ("anyelement", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."ialike" ("anyelement", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."ialike" ("anyelement", "text") TO "service_role";

--
-- Name: FUNCTION "ialike"("anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."ialike" ("anyelement", "text", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."ialike" ("anyelement", "text", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."ialike" ("anyelement", "text", "text") TO "service_role";

--
-- Name: FUNCTION "imatches"("anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."imatches" ("anyelement", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."imatches" ("anyelement", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."imatches" ("anyelement", "text") TO "service_role";

--
-- Name: FUNCTION "imatches"("anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."imatches" ("anyelement", "text", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."imatches" ("anyelement", "text", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."imatches" ("anyelement", "text", "text") TO "service_role";

--
-- Name: FUNCTION "in_todo"(); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."in_todo" () TO "anon";

GRANT ALL ON FUNCTION "public"."in_todo" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."in_todo" () TO "service_role";

--
-- Name: FUNCTION "is"("anyelement", "anyelement"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."is" ("anyelement", "anyelement") TO "anon";

GRANT ALL ON FUNCTION "public"."is" ("anyelement", "anyelement") TO "authenticated";

GRANT ALL ON FUNCTION "public"."is" ("anyelement", "anyelement") TO "service_role";

--
-- Name: FUNCTION "is"("anyelement", "anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."is" ("anyelement", "anyelement", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."is" ("anyelement", "anyelement", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."is" ("anyelement", "anyelement", "text") TO "service_role";

--
-- Name: FUNCTION "isnt"("anyelement", "anyelement"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."isnt" ("anyelement", "anyelement") TO "anon";

GRANT ALL ON FUNCTION "public"."isnt" ("anyelement", "anyelement") TO "authenticated";

GRANT ALL ON FUNCTION "public"."isnt" ("anyelement", "anyelement") TO "service_role";

--
-- Name: FUNCTION "isnt"("anyelement", "anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."isnt" ("anyelement", "anyelement", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."isnt" ("anyelement", "anyelement", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."isnt" ("anyelement", "anyelement", "text") TO "service_role";

--
-- Name: FUNCTION "lives_ok"("text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."lives_ok" ("text") TO "anon";

GRANT ALL ON FUNCTION "public"."lives_ok" ("text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."lives_ok" ("text") TO "service_role";

--
-- Name: FUNCTION "lives_ok"("text", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."lives_ok" ("text", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."lives_ok" ("text", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."lives_ok" ("text", "text") TO "service_role";

--
-- Name: FUNCTION "matches"("anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."matches" ("anyelement", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."matches" ("anyelement", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."matches" ("anyelement", "text") TO "service_role";

--
-- Name: FUNCTION "matches"("anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."matches" ("anyelement", "text", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."matches" ("anyelement", "text", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."matches" ("anyelement", "text", "text") TO "service_role";

--
-- Name: FUNCTION "no_plan"(); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."no_plan" () TO "anon";

GRANT ALL ON FUNCTION "public"."no_plan" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."no_plan" () TO "service_role";

--
-- Name: FUNCTION "num_failed"(); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."num_failed" () TO "anon";

GRANT ALL ON FUNCTION "public"."num_failed" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."num_failed" () TO "service_role";

--
-- Name: FUNCTION "ok"(boolean); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."ok" (BOOLEAN) TO "anon";

GRANT ALL ON FUNCTION "public"."ok" (BOOLEAN) TO "authenticated";

GRANT ALL ON FUNCTION "public"."ok" (BOOLEAN) TO "service_role";

--
-- Name: FUNCTION "ok"(boolean, "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."ok" (BOOLEAN, "text") TO "anon";

GRANT ALL ON FUNCTION "public"."ok" (BOOLEAN, "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."ok" (BOOLEAN, "text") TO "service_role";

--
-- Name: FUNCTION "os_name"(); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."os_name" () TO "anon";

GRANT ALL ON FUNCTION "public"."os_name" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."os_name" () TO "service_role";

--
-- Name: FUNCTION "pass"(); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."pass" () TO "anon";

GRANT ALL ON FUNCTION "public"."pass" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."pass" () TO "service_role";

--
-- Name: FUNCTION "pass"("text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."pass" ("text") TO "anon";

GRANT ALL ON FUNCTION "public"."pass" ("text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."pass" ("text") TO "service_role";

--
-- Name: FUNCTION "performs_ok"("text", numeric); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."performs_ok" ("text", NUMERIC) TO "anon";

GRANT ALL ON FUNCTION "public"."performs_ok" ("text", NUMERIC) TO "authenticated";

GRANT ALL ON FUNCTION "public"."performs_ok" ("text", NUMERIC) TO "service_role";

--
-- Name: FUNCTION "performs_ok"("text", numeric, "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."performs_ok" ("text", NUMERIC, "text") TO "anon";

GRANT ALL ON FUNCTION "public"."performs_ok" ("text", NUMERIC, "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."performs_ok" ("text", NUMERIC, "text") TO "service_role";

--
-- Name: FUNCTION "performs_within"("text", numeric, numeric); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC) TO "anon";

GRANT ALL ON FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC) TO "authenticated";

GRANT ALL ON FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC) TO "service_role";

--
-- Name: FUNCTION "performs_within"("text", numeric, numeric, integer); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC, INTEGER) TO "anon";

GRANT ALL ON FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC, INTEGER) TO "authenticated";

GRANT ALL ON FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC, INTEGER) TO "service_role";

--
-- Name: FUNCTION "performs_within"("text", numeric, numeric, "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC, "text") TO "anon";

GRANT ALL ON FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC, "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC, "text") TO "service_role";

--
-- Name: FUNCTION "performs_within"("text", numeric, numeric, integer, "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC, INTEGER, "text") TO "anon";

GRANT ALL ON FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC, INTEGER, "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."performs_within" ("text", NUMERIC, NUMERIC, INTEGER, "text") TO "service_role";

--
-- Name: FUNCTION "pg_version"(); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."pg_version" () TO "anon";

GRANT ALL ON FUNCTION "public"."pg_version" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."pg_version" () TO "service_role";

--
-- Name: FUNCTION "pg_version_num"(); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."pg_version_num" () TO "anon";

GRANT ALL ON FUNCTION "public"."pg_version_num" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."pg_version_num" () TO "service_role";

--
-- Name: FUNCTION "pgtap_version"(); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."pgtap_version" () TO "anon";

GRANT ALL ON FUNCTION "public"."pgtap_version" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."pgtap_version" () TO "service_role";

--
-- Name: FUNCTION "plan"(integer); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."plan" (INTEGER) TO "anon";

GRANT ALL ON FUNCTION "public"."plan" (INTEGER) TO "authenticated";

GRANT ALL ON FUNCTION "public"."plan" (INTEGER) TO "service_role";

--
-- Name: FUNCTION "skip"(integer); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."skip" (INTEGER) TO "anon";

GRANT ALL ON FUNCTION "public"."skip" (INTEGER) TO "authenticated";

GRANT ALL ON FUNCTION "public"."skip" (INTEGER) TO "service_role";

--
-- Name: FUNCTION "skip"("text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."skip" ("text") TO "anon";

GRANT ALL ON FUNCTION "public"."skip" ("text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."skip" ("text") TO "service_role";

--
-- Name: FUNCTION "skip"(integer, "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."skip" (INTEGER, "text") TO "anon";

GRANT ALL ON FUNCTION "public"."skip" (INTEGER, "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."skip" (INTEGER, "text") TO "service_role";

--
-- Name: FUNCTION "skip"("why" "text", "how_many" integer); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."skip" ("why" "text", "how_many" INTEGER) TO "anon";

GRANT ALL ON FUNCTION "public"."skip" ("why" "text", "how_many" INTEGER) TO "authenticated";

GRANT ALL ON FUNCTION "public"."skip" ("why" "text", "how_many" INTEGER) TO "service_role";

--
-- Name: FUNCTION "throws_ok"("text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."throws_ok" ("text") TO "anon";

GRANT ALL ON FUNCTION "public"."throws_ok" ("text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."throws_ok" ("text") TO "service_role";

--
-- Name: FUNCTION "throws_ok"("text", integer); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."throws_ok" ("text", INTEGER) TO "anon";

GRANT ALL ON FUNCTION "public"."throws_ok" ("text", INTEGER) TO "authenticated";

GRANT ALL ON FUNCTION "public"."throws_ok" ("text", INTEGER) TO "service_role";

--
-- Name: FUNCTION "throws_ok"("text", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."throws_ok" ("text", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."throws_ok" ("text", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."throws_ok" ("text", "text") TO "service_role";

--
-- Name: FUNCTION "throws_ok"("text", integer, "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."throws_ok" ("text", INTEGER, "text") TO "anon";

GRANT ALL ON FUNCTION "public"."throws_ok" ("text", INTEGER, "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."throws_ok" ("text", INTEGER, "text") TO "service_role";

--
-- Name: FUNCTION "throws_ok"("text", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."throws_ok" ("text", "text", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."throws_ok" ("text", "text", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."throws_ok" ("text", "text", "text") TO "service_role";

--
-- Name: FUNCTION "throws_ok"("text", character, "text", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."throws_ok" ("text", CHARACTER, "text", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."throws_ok" ("text", CHARACTER, "text", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."throws_ok" ("text", CHARACTER, "text", "text") TO "service_role";

--
-- Name: FUNCTION "throws_ok"("text", integer, "text", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."throws_ok" ("text", INTEGER, "text", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."throws_ok" ("text", INTEGER, "text", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."throws_ok" ("text", INTEGER, "text", "text") TO "service_role";

--
-- Name: FUNCTION "todo"("how_many" integer); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."todo" ("how_many" INTEGER) TO "anon";

GRANT ALL ON FUNCTION "public"."todo" ("how_many" INTEGER) TO "authenticated";

GRANT ALL ON FUNCTION "public"."todo" ("how_many" INTEGER) TO "service_role";

--
-- Name: FUNCTION "todo"("why" "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."todo" ("why" "text") TO "anon";

GRANT ALL ON FUNCTION "public"."todo" ("why" "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."todo" ("why" "text") TO "service_role";

--
-- Name: FUNCTION "todo"("how_many" integer, "why" "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."todo" ("how_many" INTEGER, "why" "text") TO "anon";

GRANT ALL ON FUNCTION "public"."todo" ("how_many" INTEGER, "why" "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."todo" ("how_many" INTEGER, "why" "text") TO "service_role";

--
-- Name: FUNCTION "todo"("why" "text", "how_many" integer); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."todo" ("why" "text", "how_many" INTEGER) TO "anon";

GRANT ALL ON FUNCTION "public"."todo" ("why" "text", "how_many" INTEGER) TO "authenticated";

GRANT ALL ON FUNCTION "public"."todo" ("why" "text", "how_many" INTEGER) TO "service_role";

--
-- Name: FUNCTION "todo_end"(); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."todo_end" () TO "anon";

GRANT ALL ON FUNCTION "public"."todo_end" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."todo_end" () TO "service_role";

--
-- Name: FUNCTION "todo_start"(); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."todo_start" () TO "anon";

GRANT ALL ON FUNCTION "public"."todo_start" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."todo_start" () TO "service_role";

--
-- Name: FUNCTION "todo_start"("text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."todo_start" ("text") TO "anon";

GRANT ALL ON FUNCTION "public"."todo_start" ("text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."todo_start" ("text") TO "service_role";

--
-- Name: FUNCTION "truncate_all_tables"(); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."truncate_all_tables" () TO "anon";

GRANT ALL ON FUNCTION "public"."truncate_all_tables" () TO "authenticated";

GRANT ALL ON FUNCTION "public"."truncate_all_tables" () TO "service_role";

--
-- Name: FUNCTION "truncate_all_tables"("schema_name" "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."truncate_all_tables" ("schema_name" "text") TO "anon";

GRANT ALL ON FUNCTION "public"."truncate_all_tables" ("schema_name" "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."truncate_all_tables" ("schema_name" "text") TO "service_role";

--
-- Name: FUNCTION "unalike"("anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."unalike" ("anyelement", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."unalike" ("anyelement", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."unalike" ("anyelement", "text") TO "service_role";

--
-- Name: FUNCTION "unalike"("anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."unalike" ("anyelement", "text", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."unalike" ("anyelement", "text", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."unalike" ("anyelement", "text", "text") TO "service_role";

--
-- Name: FUNCTION "unialike"("anyelement", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."unialike" ("anyelement", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."unialike" ("anyelement", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."unialike" ("anyelement", "text") TO "service_role";

--
-- Name: FUNCTION "unialike"("anyelement", "text", "text"); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION "public"."unialike" ("anyelement", "text", "text") TO "anon";

GRANT ALL ON FUNCTION "public"."unialike" ("anyelement", "text", "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."unialike" ("anyelement", "text", "text") TO "service_role";

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
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "service_role";

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
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "service_role";

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
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "service_role";

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