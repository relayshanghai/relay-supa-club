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

export const getProfileByEmail = (db: RelayDatabase) => async (email: string) => {
    const { data, error } = await db.from('profiles').select().eq('email', email).maybeSingle();
    if (error) throw error;
    return data;
};

export const incrementTotalLogin = (db: RelayDatabase) => async (email: string) => {
    const profile = await getProfileByEmail(db)(email);

    if (!profile) return null;

    const { data, error } = await db
        .from('profiles')
        .update({ total_sessions: profile.total_sessions + 1 })
        .eq('email', email)
        .select()
        .maybeSingle();

    if (error) throw error;

    return data;
};
