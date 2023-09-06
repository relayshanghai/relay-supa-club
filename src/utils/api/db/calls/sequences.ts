import type { FunnelStatus, RelayDatabase, Sequence, SequenceInsert, SequenceUpdate } from '../types';

export const getSequencesByCompanyIdCall = (supabaseClient: RelayDatabase) => async (companyId: string) => {
    if (!companyId) return;
    const { data, error } = await supabaseClient.from('sequences').select('*').eq('company_id', companyId);

    if (error) throw error;
    return data;
};

export const getSequenceByIdCall =
    (supabaseClient: RelayDatabase) =>
    async (id: string): Promise<Sequence> => {
        const { data, error } = await supabaseClient.from('sequences').select('*').eq('id', id).single();

        if (error) throw error;
        return data;
    };

export const countSequenceInfluencers = (db: RelayDatabase) => async (sequenceId: string) => {
    const { count, error } = await db.from('sequence_influencers').select('*', { count: 'exact', head: true }).eq('sequence_id', sequenceId);
    if (error) throw error;
    return count ?? 0;
};

export const updateSequenceCall =
    (supabaseClient: RelayDatabase) => async (update: SequenceUpdate & { id: string }) => {
        update.updated_at = new Date().toISOString();
        const { data, error } = await supabaseClient
            .from('sequences')
            .update(update)
            .eq('id', update.id)
            .select()
            .single();
        if (error) throw error;
        return data;
    };

export const createSequenceCall = (supabaseClient: RelayDatabase) => async (insert: SequenceInsert) => {
    const { data, error } = await supabaseClient.from('sequences').insert(insert).select().single();
    if (error) throw error;
    return data;
};

const sequenceInfluencersToDelete: FunnelStatus[] = ['To Contact', 'In Sequence', 'Ignored'];

export const deleteSequenceCall = (supabaseClient: RelayDatabase) => async (id: string) => {
    const { error } = await supabaseClient
        .from('sequences')
        .update({
            id,
            deleted: true,
        })
        .eq('id', id);
    if (error) throw error;
    const { error: deleteInfluencersError } = await supabaseClient
        .from('sequence_influencers')
        .delete()
        .in('funnel_status', sequenceInfluencersToDelete)
        .eq('sequence_id', id);
    if (deleteInfluencersError) throw deleteInfluencersError;
};
