import type { RelayDatabase } from '../types';

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

export const getSequenceEmailsBySequenceInfluencersCall =
    (supabaseClient: RelayDatabase) => async (sequenceInfluencerIds: string[]) => {
        const { data, error } = await supabaseClient
            .from('sequence_emails')
            .select('id, email_message_id, job_id')
            .in('sequence_influencer_id', sequenceInfluencerIds);

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

export const getSequenceEmailByInfluencerAndSequenceStep =
    (supabaseClient: RelayDatabase) => async (sequenceInfluencerId: string, sequenceStepId: string) => {
        return await supabaseClient
            .from('sequence_emails')
            .select('id, email_delivery_status')
            .eq('sequence_influencer_id', sequenceInfluencerId)
            .eq('sequence_step_id', sequenceStepId)
            .limit(1)
            .single();
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

export const getAllSequenceEmailsCall = (supabaseClient: RelayDatabase) => async (ids: string[]) => {
    const { data, error } = await supabaseClient.from('sequence_emails').select('*').in('sequence_id', ids);
    if (error) throw error;
    return data;
};

export const deleteSequenceEmailByMessageIdCall = (supabaseClient: RelayDatabase) => async (messageId: string) => {
    const { error } = await supabaseClient.from('sequence_emails').delete().eq('email_message_id', messageId);
    if (error) throw error;
};
export const deleteSequenceEmailsByInfluencerCall = (supabaseClient: RelayDatabase) => async (influencerId: string) => {
    const { error } = await supabaseClient.from('sequence_emails').delete().eq('sequence_influencer_id', influencerId);
    if (error) throw error;
};

/** only gets where the send at date is in the future or from the last 24 hours. Date is calculated based on America/Chicago timezone */
export const getSequenceEmailsByEmailEngineAccountId = (supabaseClient: RelayDatabase) => async (accountId: string) => {
    const { data, error } = await supabaseClient.rpc('fetch_email_count_per_account_by_date', {
        account_id: accountId,
    });

    if (error) throw error;
    return data;
};
