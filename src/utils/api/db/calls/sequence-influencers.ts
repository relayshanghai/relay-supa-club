import { serverLogger } from 'src/utils/logger-server';
import type { RelayDatabase, SequenceInfluencerInsert, SequenceInfluencerUpdate } from '../types';

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
export const getSequenceInfluencersBySequenceIdsCall =
    (supabaseClient: RelayDatabase) => async (sequenceIds: string[]) => {
        if (!sequenceIds) {
            throw new Error('No sequenceIds provided');
        }
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .select(
                '*, socialProfile: influencer_social_profiles (recent_post_title, recent_post_url), address: addresses (*)',
            )
            .in('sequence_id', sequenceIds);

        if (error) throw error;
        return data;
    };

export const getSequenceInfluencersCountByCompanyIdCall =
    (supabaseClient: RelayDatabase) => async (companyId: string) => {
        const { error, count } = await supabaseClient
            .from('sequence_influencers')
            .select('', { count: 'exact', head: true })
            .eq('company_id', companyId);
        if (error) throw error;
        if (!count) return 0;
        return count;
    };

export const getSequenceInfluencersIqDataIdAndSequenceNameByCompanyIdCall =
    (supabaseClient: RelayDatabase) => async (companyId: string) => {
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .select('iqdata_id, sequences(name)')
            .eq('company_id', companyId);

        if (error) throw error;
        return data;
    };

export const getSequenceInfluencerByEmailAndCompanyCall =
    (supabaseClient: RelayDatabase) => async (email: string, companyId?: string | null) => {
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .select('*')
            .limit(1)
            .match({ email, company_id: companyId })
            .single();
        if (error) throw error;
        return data;
    };

/**
 * If updating the email, also pass in the company_id so we can check if the email already exists for this company
 */
export const updateSequenceInfluencerCall =
    (supabaseClient: RelayDatabase) => async (update: SequenceInfluencerUpdate) => {
        if (Object.keys(update).includes('platform') && !update.platform) {
            serverLogger(`strange update ${update}`);
        }
        update.updated_at = new Date().toISOString();
        if (update.email) {
            if (!update.company_id) {
                throw new Error('Must provide a company id when updating email');
            }
            const { data: existingEmail } = await supabaseClient
                .from('sequence_influencers')
                .select('email')
                .limit(1)
                .match({ email: update.email, company_id: update.company_id })
                .single();
            if (existingEmail) {
                throw new Error('Email already exists for this company');
            }
        }
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .update(update)
            .eq('id', update.id)
            .select()
            .single();
        if (error) throw error;
        return data;
    };

export const createSequenceInfluencerCall =
    (supabaseClient: RelayDatabase) => async (sequenceInfluencer: SequenceInfluencerInsert) => {
        if (!sequenceInfluencer.company_id) {
            throw new Error('No company id provided');
        }
        if (!sequenceInfluencer.iqdata_id) {
            throw new Error('No iqdata id provided');
        }
        const { data: existingIqdata } = await supabaseClient
            .from('sequence_influencers')
            .select('iqdata_id, company_id, email')
            .match({ iqdata_id: sequenceInfluencer.iqdata_id, company_id: sequenceInfluencer.company_id });
        if (existingIqdata && existingIqdata.length > 0) {
            throw new Error('Influencer already exists for this company');
        }
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .insert(sequenceInfluencer)
            .select()
            .single();
        if (error) throw error;
        return data;
    };

export const deleteSequenceInfluencersCall = (supabaseClient: RelayDatabase) => async (ids: string[]) => {
    const { error } = await supabaseClient.from('sequence_influencers').delete().in('id', ids);
    if (error) throw error;
};
