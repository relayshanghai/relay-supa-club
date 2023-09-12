import type { RelayDatabase, SequenceInfluencerInsert, SequenceInfluencerUpdate } from '../types';

export const getSequenceInfluencerByIdCall = (supabaseClient: RelayDatabase) => async (id: string) => {
    if (!id) {
        throw new Error('No id provided');
    }
    const { data, error } = await supabaseClient.from('sequence_influencers').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};

export const getSequenceInfluencersBySequenceIdCall = (supabaseClient: RelayDatabase) => async (sequenceId: string) => {
    if (!sequenceId) {
        throw new Error('No sequenceId provided');
    }
    const { data, error } = await supabaseClient.from('sequence_influencers').select('*').eq('sequence_id', sequenceId);

    if (error) throw error;
    return data;
};

export const getSequenceInfluencersCountByCompanyIdCall =
    (supabaseClient: RelayDatabase) => async (companyId: string) => {
        const { error, count } = await supabaseClient
            .from('sequence_influencers')
            .select('', { count: 'exact', head: true })
            .eq('company_id', companyId);
        if (error) throw error;
        if (!count) return 0;
        return count;
    };

export const getSequenceInfluencersIqDataIdAndSequenceNameByCompanyIdCall =
    (supabaseClient: RelayDatabase) => async (companyId: string) => {
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .select('iqdata_id, sequences(name)')
            .eq('company_id', companyId);

        if (error) throw error;
        return data;
    };

export const getSequenceInfluencerByEmailAndCompanyCall =
    (supabaseClient: RelayDatabase) => async (email: string, companyId?: string | null) => {
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .select('*')
            .limit(1)
            .match({ email, company_id: companyId })
            .single();
        if (error) throw error;
        return data;
    };

/**
 * If updating the email, also pass in the company_id so we can check if the email already exists for this company
 */
export const updateSequenceInfluencerCall =
    (supabaseClient: RelayDatabase) => async (update: SequenceInfluencerUpdate) => {
        update.updated_at = new Date().toISOString();
        if (update.email) {
            if (!update.company_id) {
                throw new Error('Must provide a company id when updating email');
            }
            const { data: existingEmail } = await supabaseClient
                .from('sequence_influencers')
                .select('email')
                .limit(1)
                .match({ email: update.email, company_id: update.company_id })
                .single();
            if (existingEmail) {
                throw new Error('Email already exists for this company');
            }
        }
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .update(update)
            .eq('id', update.id)
            .select()
            .single();
        if (error) throw error;
        return data;
    };

export const createSequenceInfluencerCall =
    (supabaseClient: RelayDatabase) => async (sequenceInfluencer: SequenceInfluencerInsert) => {
        const { data: existingEmail } = await supabaseClient
            .from('sequence_influencers')
            .select('email')
            .match({ email: sequenceInfluencer.email, company_id: sequenceInfluencer.company_id })
            .maybeSingle();
        if (existingEmail) {
            throw new Error('Email already exists for this company');
        }
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .insert(sequenceInfluencer)
            .select()
            .single();
        if (error) throw error;
        return data;
    };

export const deleteSequenceInfluencerCall = (supabaseClient: RelayDatabase) => async (ids: string[]) => {
    const { error } = await supabaseClient.from('sequence_influencers').delete().in('id', ids);
    if (error) throw error;
};
