// 'no-client' means that the functions are not wrapping the client in a higher order function, so that the client needs to be imported here, meaning these calls can only be used by the backend.
import { supabase } from 'src/utils/supabase-client'; // TODO: refactor calls so that we do not need to import supabase here. https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/721
import type { InfluencerRow, InfluencerSocialProfileRow } from '../types';

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
