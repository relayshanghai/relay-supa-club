import type { RelayDatabase, SequenceInfluencerUpdate } from '../api/db';

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

export const updateSequenceInfluencerCall =
    (supabaseClient: RelayDatabase) => async (update: SequenceInfluencerUpdate) => {
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .update(update)
            .eq('id', update.id)
            .select()
            .single();
        if (error) throw error;
        return data;
    };
