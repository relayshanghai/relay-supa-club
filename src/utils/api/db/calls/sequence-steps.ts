import type { RelayDatabase, SequenceStepUpdate } from '../types';

export const getSequenceStepsBySequenceIdCall = (supabaseClient: RelayDatabase) => async (sequenceId: string) => {
    if (!sequenceId) return;
    const { data, error } = await supabaseClient.from('sequence_steps').select('*').eq('sequence_id', sequenceId);

    if (error) throw error;
    return data;
};

export const updateSequenceStepCall = (supabaseClient: RelayDatabase) => async (update: SequenceStepUpdate) => {
    const { data, error } = await supabaseClient.from('sequence_steps').update(update).eq('id', update.id).single();
    if (error) throw error;
    return data;
};
