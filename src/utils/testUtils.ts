/* eslint-disable no-console */
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';
import type { AccountRole, DatabaseWithCustomTypes } from '../../types';

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
    // Function defined in the utils/api/db/sql/functions.sql file
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

interface FakeUser {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    role?: AccountRole;
}

export const signInTestUser = async ({ email, password }: FakeUser) => {
    const { data, error: error2 } = await testSupabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error2) {
        throw new Error(error2.message);
    }
    if (!data.user) {
        throw new Error('No user returned from signin');
    }
    return data.user;
};

const signUpTestUser = async ({
    email,
    password,
    firstName,
    lastName,
    companyName,
    role,
}: FakeUser) => {
    // signup a user
    const { data, error } = await testSupabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName || testUserFirstName,
                last_name: lastName || testUserLastName,
            },
        },
    });
    if (error) {
        throw new Error(error.message);
    }
    if (!data.user) {
        throw new Error('No user returned from signup');
    }

    let existingCompany;

    if (companyName) {
        const { data: existingCompanyFound } = await testSupabaseServiceAccount
            .from('companies')
            .select()
            .eq('name', companyName)
            .single();

        existingCompany = existingCompanyFound;
    }

    if (!existingCompany) {
        // make a company for the user
        const { data: company, error: error4 } = await testSupabaseServiceAccount
            .from('companies')
            .insert({ name: testCompanyName })
            .select()
            .single();

        if (error4) {
            throw new Error(error4.message);
        }
        existingCompany = company;
    }

    // the user's profile should be available because it was created by a trigger one the auth.users table. Also need to use the service account to bypass RLS
    const { error: error3 } = await testSupabaseServiceAccount
        .from('profiles')
        // using upsert here because sometimes the trigger has not fired yet
        .upsert({
            id: data.user.id,
            first_name: firstName || testUserFirstName,
            last_name: lastName || testUserLastName,
            company_id: existingCompany.id,
            updated_at: new Date().toISOString(),
            user_role: role || 'company_teammate',
        })
        .eq('id', data.user.id)
        .select()
        .single();
    if (error3) {
        throw new Error(error3.message);
    }
};

/** Wipes the DB, the populates the database  */
export const populateDB = async (users?: FakeUser[]) => {
    await wipeDatabase();
    if (users?.length === 0) {
        await signUpTestUser({
            email: testUserEmail,
            password: testUserPassword,
        });
    } else if (users) {
        for (const user of users) {
            await signUpTestUser(user);
        }
    }
    console.log('database populated');
};
