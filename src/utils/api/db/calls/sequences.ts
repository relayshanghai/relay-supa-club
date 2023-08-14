import type { RelayDatabase, SequenceInsert, SequenceUpdate } from '../types';

export const getSequencesByCompanyIdCall = (supabaseClient: RelayDatabase) => async (companyId: string) => {
    if (!companyId) return;
    const { data, error } = await supabaseClient.from('sequences').select('*').eq('company_id', companyId);

    if (error) throw error;
    return data;
};

export const getSequenceByIdCall = (supabaseClient: RelayDatabase) => async (id: string) => {
    const { data, error } = await supabaseClient.from('sequences').select('*').eq('id', id).single();

    if (error) throw error;
    return data;
};

export const updateSequenceCall =
    (supabaseClient: RelayDatabase) => async (update: SequenceUpdate & { id: string }) => {
        const { data, error } = await supabaseClient.from('sequences').update(update).eq('id', update.id).single();
        if (error) throw error;
        return data;
    };

export const createSequenceCall = (supabaseClient: RelayDatabase) => async (sequence: SequenceInsert) => {
    const { data, error } = await supabaseClient.from('sequences').insert(sequence).single();
    if (error) throw error;
    return data;
};

export const deleteSequenceCall = (supabaseClient: RelayDatabase) => async (id: string) => {
    const { error } = await supabaseClient.from('sequences').delete().eq('id', id);
    if (error) throw error;
};
