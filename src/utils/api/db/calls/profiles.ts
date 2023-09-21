import type { RelayDatabase } from '../types';
import type { ProfileDB } from '../types';

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

export const isProfileRow = (value: any): value is ProfileDB => {
    const profileRowKeys: Array<keyof ProfileDB> = [
        'avatar_url',
        'company_id',
        'created_at',
        'email',
        'email_engine_account_id',
        'first_name',
        'id',
        'last_name',
        'phone',
        'sequence_send_email',
        'total_outreach_sent',
        'total_reports',
        'total_searches',
        'total_sequence_influencers',
        'total_sessions',
        'updated_at',
        'user_role',
    ];

    const valueKeys = Object.keys(value);
    const hasMissingKey = profileRowKeys.some((k) => !valueKeys.includes(k));

    return hasMissingKey ? false : true;
};

export const getProfileByIdentifer = (db: RelayDatabase) => async (identifier: string) => {
    const { data, error } = await db
        .from('profiles')
        .select()
        .or(`email.eq.${identifier},id.eq.${identifier}`)
        .maybeSingle();
    if (error) throw error;

    return data;
};

export const incrementTotalLogin =
    (db: RelayDatabase) =>
    async (identifier: string | ProfileDB, value = 1) => {
        let profile: ProfileDB | null = null;

        if (typeof identifier === 'string') {
            profile = await getProfileByIdentifer(db)(identifier);
        }

        if (isProfileRow(identifier)) {
            profile = identifier;
        }

        if (!profile) return null;

        const { data, error } = await db
            .from('profiles')
            .update({ total_sessions: profile.total_sessions + value })
            .eq('id', profile.id)
            .select()
            .maybeSingle();

        if (error) throw error;

        return data;
    };
