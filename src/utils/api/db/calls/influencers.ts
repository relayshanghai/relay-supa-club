import { supabase } from 'src/utils/supabase-client';
import type { Database } from 'types/supabase';

export type InfluencerInsert = Database['public']['Tables']['influencers']['Insert'];
export type InfluencerRow = Database['public']['Tables']['influencers']['Row'];

export type InfluencerSocialProfileInsert = Database['public']['Tables']['influencer_social_profiles']['Insert'];
export type InfluencerSocialProfileRow = Database['public']['Tables']['influencer_social_profiles']['Row'];

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
            referenceId,
        })
        .maybeSingle();

    if (socialProfile.error) {
        throw socialProfile.error;
    }

    return socialProfile.data;
};

export const insertInfluencer = async (data: InfluencerInsert): Promise<InfluencerRow> => {
    const influencer = await supabase.from('influencers').insert(data).select();

    if (influencer.error) {
        throw influencer.error;
    }

    return influencer.data[0];
};

export const insertInfluencerSocialProfile = async (
    data: InfluencerSocialProfileInsert,
): Promise<InfluencerSocialProfileRow> => {
    const socialProfile = await supabase.from('influencer_social_profiles').insert(data).select();

    if (socialProfile.error) {
        throw socialProfile.error;
    }

    return socialProfile.data[0];
};
