import type { RelayDatabase } from '../types';

export const getInfluencerSocialProfileByIdCall = (supabaseClient: RelayDatabase) => async (id: string) => {
    if (!id) throw new Error('no ID provided');
    const { data, error } = await supabaseClient.from('influencer_social_profiles').select('*').eq('id', id).single();

    if (error) throw error;
    return data;
};

export const getInfluencerSocialProfilesByIdsCall = (supabaseClient: RelayDatabase) => async (ids: string[]) => {
    if (!ids || ids.length === 0) throw new Error('no IDs provided');
    const { data, error } = await supabaseClient.from('influencer_social_profiles').select('*').in('id', ids);
    if (error) throw error;
    return data;
};
