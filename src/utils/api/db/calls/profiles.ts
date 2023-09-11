import type { RelayDatabase } from '../types';

export const getProfileByIdCall = (supabaseClient: RelayDatabase) => async (id: string, abortSignal?: AbortSignal) => {
    if (abortSignal) {
        return await supabaseClient.from('profiles').select().abortSignal(abortSignal).eq('id', id).single();
    }
    return await supabaseClient.from('profiles').select().eq('id', id).single();
};

export const getProfileByEmailEngineAccountQuery = (supabaseClient: RelayDatabase) => async (account: string) => {
    const { data, error } = await supabaseClient
        .from('profiles')
        .select()
        .eq('email_engine_account_id', account)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
};
