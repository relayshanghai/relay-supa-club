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

/** Connects to the `testing` supabase project. Includes a `truncate_all_tables` function which is unavailable in the real database */
export const testSupabase = createClient<TestDB>(supabaseUrl, supabaseAnonKey);

/** The service account is not beholden to RLS rules */
export const testSupabaseServiceAccount = createClient<TestDB>(supabaseUrl, supabaseServiceKey);

export const wipeDatabase = async () => {
    // Function defined in the db/functions.sql file
    // Call a function https://supabase.com/docs/reference/javascript/rpc
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
