import type { RelayDatabase, SequenceInfluencerUpdate, SequenceInfluencerInsert } from '../types';

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

export const getSequenceInfluencersByCompanyIdCall = (supabaseClient: RelayDatabase) => async (companyId: string) => {
    const { data, error } = await supabaseClient.from('sequence_influencers').select('*').eq('company_id', companyId);

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

export const updateSequenceInfluencerCall =
    (supabaseClient: RelayDatabase) => async (update: SequenceInfluencerUpdate) => {
        update.updated_at = new Date().toISOString();
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
            .limit(1)
            .match({ email: sequenceInfluencer.email, company_id: sequenceInfluencer.company_id })
            .single();
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

export const deleteSequenceInfluencerCall = (supabaseClient: RelayDatabase) => async (id: string) => {
    const { error } = await supabaseClient.from('sequence_influencers').delete().eq('id', id);
    if (error) throw error;
};
