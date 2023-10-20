import type { RelayDatabase, SequenceEmailInsert, SequenceEmailUpdate } from '../types';

export const getSequenceEmailsBySequenceCall = (supabaseClient: RelayDatabase) => async (sequenceId: string) => {
    if (!sequenceId) return [];
    const { data, error } = await supabaseClient.from('sequence_emails').select('*').eq('sequence_id', sequenceId);

    if (error) throw error;
    return data;
};

export const getSequenceEmailsBySequenceInfluencerCall =
    (supabaseClient: RelayDatabase) => async (sequenceInfluencerId: string) => {
        if (!sequenceInfluencerId) return [];
        const { data, error } = await supabaseClient
            .from('sequence_emails')
            .select('*')
            .eq('sequence_influencer_id', sequenceInfluencerId);

        if (error) throw error;
        return data;
    };

export const getSequenceEmailByMessageIdCall = (supabaseClient: RelayDatabase) => async (messageId: string) => {
    const { data, error } = await supabaseClient
        .from('sequence_emails')
        .select('*')
        .eq('email_message_id', messageId)
        .single();
    if (error) throw error;
    return data;
};

export const getSequenceEmailByInfluencerIdAndSequenceStepIdCall =
    (supabaseClient: RelayDatabase) => async (influencerId: string, sequenceStepId: string) => {
        const { data, error } = await supabaseClient
            .from('sequence_emails')
            .select('*')
            .limit(1)
            .eq('sequence_influencer_id', influencerId)
            .eq('sequence_step_id', sequenceStepId)
            .single();
        if (error) throw error;
        return data;
    };

export const getSequenceEmailAndSequencesByMessageIdCall =
    (supabaseClient: RelayDatabase) => async (messageId: string) => {
        const { data, error } = await supabaseClient
            .from('sequence_emails')
            .select(`*,sequences(name),sequence_influencers(id)`)
            .eq('email_message_id', messageId)
            .single();
        if (error) throw error;
        return data;
    };

export const updateSequenceEmailCall = (supabaseClient: RelayDatabase) => async (update: SequenceEmailUpdate) => {
    update.updated_at = new Date().toISOString();
    const { data, error } = await supabaseClient.from('sequence_emails').update(update).eq('id', update.id).single();
    if (error) throw error;
    return data;
};

export const insertSequenceEmailCall = (supabaseClient: RelayDatabase) => async (insert: SequenceEmailInsert) => {
    const { data, error } = await supabaseClient.from('sequence_emails').insert(insert).single();
    if (error) throw error;
    return data;
};

export const getAllSequenceEmailsCall = (supabaseClient: RelayDatabase) => async (ids: string[]) => {
    const { data, error } = await supabaseClient.from('sequence_emails').select('*').in('sequence_id', ids);
    if (error) throw error;
    return data;
};

export const deleteSequenceEmailByMessageIdCall = (supabaseClient: RelayDatabase) => async (messageId: string) => {
    const { error } = await supabaseClient.from('sequence_emails').delete().eq('email_message_id', messageId);
    if (error) throw error;
};
