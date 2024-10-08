import type { RelayDatabase, TemplateVariableInsert, TemplateVariableUpdate } from '../types';

export const getTemplateVariablesBySequenceIdCall = (supabaseClient: RelayDatabase) => async (sequenceId: string) => {
    if (!sequenceId) {
        throw new Error('Sequence ID is required to get template variables');
    }
    const { data, error } = await supabaseClient.from('template_variables').select('*').eq('sequence_id', sequenceId);

    if (error) throw error;
    return data;
};

export const updateTemplateVariableCall = (supabaseClient: RelayDatabase) => async (update: TemplateVariableUpdate) => {
    update.updated_at = new Date().toISOString();
    const { data, error } = await supabaseClient.from('template_variables').update(update).eq('id', update.id).single();
    if (error) throw error;
    return data;
};

export const insertTemplateVariableCall =
    (supabaseClient: RelayDatabase) => async (insert: TemplateVariableInsert[]) => {
        const { data, error } = await supabaseClient.from('template_variables').insert(insert);
        if (error) throw error;
        return data;
    };
