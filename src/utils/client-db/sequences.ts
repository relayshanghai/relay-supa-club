import type { RelayDatabase, SequenceUpdate } from '../api/db';

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

export const updateSequenceCall = (supabaseClient: RelayDatabase) => async (update: SequenceUpdate) => {
    const { data, error } = await supabaseClient.from('sequences').update(update).eq('id', update.id).single();
    if (error) throw error;
    return data;
};
