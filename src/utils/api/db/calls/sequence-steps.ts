import type { RelayDatabase, SequenceStepInsert, SequenceStepUpdate } from '../types';

export const getSequenceStepsBySequenceIdCall = (supabaseClient: RelayDatabase) => async (sequenceId: string) => {
    if (!sequenceId) return;
    const { data, error } = await supabaseClient.from('sequence_steps').select('*').eq('sequence_id', sequenceId);

    if (error) throw error;
    return data;
};

export const updateSequenceStepCall = (supabaseClient: RelayDatabase) => async (update: SequenceStepUpdate) => {
    update.updated_at = new Date().toISOString();
    const { data, error } = await supabaseClient.from('sequence_steps').update(update).eq('id', update.id).single();
    if (error) throw error;
    return data;
};

export const insertSequenceStepsCall =
    (supabaseClient: RelayDatabase) => async (sequenceStep: SequenceStepInsert[]) => {
        const { data, error } = await supabaseClient.from('sequence_steps').insert(sequenceStep);
        if (error) throw error;
        return data;
    };
