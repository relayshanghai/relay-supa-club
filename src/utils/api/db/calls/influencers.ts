import type { RelayDatabase } from '../types';

export const getInfluencerSocialProfileByIdCall = (supabaseClient: RelayDatabase) => async (id: string) => {
    if (!id) return;
    const { data, error } = await supabaseClient.from('influencer_social_profiles').select('*').eq('id', id).single();

    if (error) throw error;
    return data;
};
