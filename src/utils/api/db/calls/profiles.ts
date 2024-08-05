import { serverLogger } from 'src/utils/logger-server';
import type { RelayDatabase } from '../types';

export const getProfileByIdCall = (supabaseClient: RelayDatabase) => async (id: string, abortSignal?: AbortSignal) => {
    if (abortSignal) {
        return await supabaseClient
            .from('profiles')
            .select('*, company: companies(*)')
            .abortSignal(abortSignal)
            .eq('id', id)
            .single();
    }
    return await supabaseClient.from('profiles').select('*, company: companies(*)').eq('id', id).single();
};

export const getProfileByEmailEngineAccountQuery = (supabaseClient: RelayDatabase) => async (account: string) => {
    const { data, error } = await supabaseClient
        .from('profiles')
        .select()
        .limit(1)
        .eq('email_engine_account_id', account)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
};

export const getFirstUserByCompanyIdCall = (supabaseClient: RelayDatabase) => async (companyId: string) => {
    const { data, error } = await supabaseClient
        .from('profiles')
        .select()
        .limit(1)
        .eq('company_id', companyId)
        .single();

    if (error) {
        throw error;
    }

    return data;
};

export const deleteUserById = (db: RelayDatabase) => async (profileId: string) => {
    const { error: profileDeleteError } = await db.from('profiles').delete().eq('id', profileId);
    if (profileDeleteError) {
        serverLogger(profileDeleteError);
    }
    const { error } = await db.auth.admin.deleteUser(profileId);
    if (error) {
        serverLogger(error);
    }
};

export const getProfileByEmail = (db: RelayDatabase) => async (email: string) => {
    const { data, error } = await db.from('profiles').select('id').eq('email', email);
    if (error) {
        serverLogger(error);
    }
    return data;
};
