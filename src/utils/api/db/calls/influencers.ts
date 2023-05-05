import { supabase } from 'src/utils/supabase-client';
import type { Database } from 'types/supabase';

export type influencerInsert = Database['public']['Tables']['influencers']['Insert'];
export type influencerRow = Database['public']['Tables']['influencers']['Row'];

export type influencerSocialProfileInsert = Database['public']['Tables']['influencer_social_profiles']['Insert'];
export type influencerSocialProfileRow = Database['public']['Tables']['influencer_social_profiles']['Row'];

export const insertInfluencer = async (data: influencerInsert): Promise<influencerRow> => {
    const influencer = await supabase.from('influencers').insert(data).select();

    if (influencer.error) {
        throw influencer.error;
    }

    return influencer.data[0];
};

export const insertInfluencerSocialProfile = async (
    data: influencerSocialProfileInsert,
): Promise<influencerSocialProfileRow> => {
    const socialProfile = await supabase.from('influencer_social_profiles').insert(data).select();

    if (socialProfile.error) {
        throw socialProfile.error;
    }

    return socialProfile.data[0];
};
