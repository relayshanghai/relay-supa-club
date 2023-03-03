/* eslint-disable no-console */
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';
import type { DatabaseWithCustomTypes } from '../../types';

const supabaseUrl = process.env.TEST_NEXT_PUBLIC_SUPABASE_URL || '';
if (!supabaseUrl) console.log('TEST_NEXT_PUBLIC_SUPABASE_URL not set');
const supabaseAnonKey = process.env.TEST_NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
if (!supabaseAnonKey) console.log('TEST_NEXT_PUBLIC_SUPABASE_ANON_KEY not set');

const supabaseServiceKey = process.env.TEST_SUPABASE_SERVICE_KEY || '';

export interface TestDB extends DatabaseWithCustomTypes {
    public: Database['public'] & {
        Functions: DatabaseWithCustomTypes['public']['Functions'] & {
            truncate_all_tables:
                | {
                      Args: Record<PropertyKey, never>;
                      Returns: undefined;
                  }
                | {
                      Args: {
                          schema_name: string;
                      };
                      Returns: undefined;
                  };
        };

        Tables: DatabaseWithCustomTypes['public']['Tables'];
    };
}
export const testSupabase = createClient<TestDB>(supabaseUrl, supabaseAnonKey);

/** The service account is not beholden to RLS rules */
export const testSupabaseServiceAccount = createClient<TestDB>(supabaseUrl, supabaseServiceKey);

// Supabase does not allow raw SQL queries.
// add functions to the db by using the sql editor in the dashboard, or by adding them in the functions tab of the db
// note that `security definer` is what gives us permission to edit the auth schema
/* 
CREATE OR REPLACE FUNCTION truncate_all_tables(schema_name TEXT)
RETURNS void AS $$
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
$$ LANGUAGE 'plpgsql' security definer;
*/
// Then you can call this function later
// Call a function https://supabase.com/docs/reference/javascript/rpc

export const wipeDatabase = async () => {
    const { error } = await testSupabase.rpc('truncate_all_tables', {
        schema_name: 'public',
    });
    if (error) {
        throw new Error(error.message);
    }
    const { error: error2 } = await testSupabase.rpc('truncate_all_tables', {
        schema_name: 'auth',
    });
    if (error2) {
        throw new Error(error2.message);
    }
    console.log('database wiped');
};

export const testUserFirstName = 'test';
export const testUserLastName = 'user';
export const testUserEmail = 'test-user@test.test';
export const testUserPassword = 'test-user-password';
export const testCompanyName = 'test company';

export const populateDB = async () => {
    await wipeDatabase();

    // signup a user
    const { error } = await testSupabase.auth.signUp({
        email: testUserEmail,
        password: testUserPassword,
        options: {
            data: {
                first_name: testUserFirstName,
                last_name: testUserLastName,
            },
        },
    });
    if (error) {
        throw new Error(error.message);
    }
    // login the user
    const { data, error: error2 } = await testSupabase.auth.signInWithPassword({
        email: testUserEmail,
        password: testUserPassword,
    });

    if (error2) {
        throw new Error(error2.message);
    }
    const id = data?.user?.id || data?.session?.user?.id;
    if (!id) {
        throw new Error('no user id');
    }

    // make a company for the user
    const { data: company, error: error4 } = await testSupabase
        .from('companies')
        .insert({ name: testCompanyName })
        .select()
        .single();

    if (error4) {
        throw new Error(error4.message);
    }

    // the user's profile should be available because it was created by a trigger one the auth.users table. Also need to use the service account to bypass RLS
    const { error: error3 } = await testSupabaseServiceAccount
        .from('profiles')
        // using upsert here because sometimes the trigger has not fired yet
        .upsert({
            id,
            first_name: testUserFirstName,
            last_name: testUserLastName,
            company_id: company.id,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
    if (error3) {
        throw new Error(error3.message);
    }
    console.log('database populated');
};
