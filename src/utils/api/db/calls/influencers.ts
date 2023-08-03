import { supabase } from 'src/utils/supabase-client';
import type { InfluencerRow, InfluencerSocialProfileRow, RelayDatabase } from '../types';

export const getInfluencerById = async (id: string): Promise<InfluencerRow | null> => {
    const influencer = await supabase
        .from('influencers')
        .select()
        .match({
            id,
        })
        .maybeSingle();

    if (influencer.error) {
        throw influencer.error;
    }

    return influencer.data;
};

// @todo we need to use the datasource user id instead of relying on the username+platform tuple
export const getInfluencerSocialProfileByReferenceId = async (
    referenceId: string,
): Promise<InfluencerSocialProfileRow | null> => {
    const socialProfile = await supabase
        .from('influencer_social_profiles')
        .select()
        .match({
            reference_id: referenceId,
        })
        .maybeSingle();

    if (socialProfile.error) {
        throw socialProfile.error;
    }

    return socialProfile.data;
};

export const getInfluencerSocialProfileByIdCall = (supabaseClient: RelayDatabase) => async (id: string) => {
    if (!id) return;
    const { data, error } = await supabaseClient.from('influencer_social_profiles').select('*').eq('id', id).single();

    if (error) throw error;
    return data;
};
