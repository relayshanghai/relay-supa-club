import type { RelayDatabase, TemplateVariableUpdate } from '../types';

export const getTemplateVariablesBySequenceIdCall = (supabaseClient: RelayDatabase) => async (sequenceId: string) => {
    if (!sequenceId) return;
    const { data, error } = await supabaseClient.from('template_variables').select('*').eq('sequence_id', sequenceId);

    if (error) throw error;
    return data;
};

export const updateTemplateVariableCall = (supabaseClient: RelayDatabase) => async (update: TemplateVariableUpdate) => {
    const { data, error } = await supabaseClient.from('template_variables').update(update).eq('id', update.id).single();
    if (error) throw error;
    return data;
};
