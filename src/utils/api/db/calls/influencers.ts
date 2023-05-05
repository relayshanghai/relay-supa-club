import { supabase } from 'src/utils/supabase-client';
import type { Database } from 'types/supabase';

export type influencerInsert = Database['public']['Tables']['influencers']['Insert'];
export type influencerRow = Database['public']['Tables']['influencers']['Row'];

export type influencerSocialProfileInsert = Database['public']['Tables']['influencer_social_profiles']['Insert'];
export type influencerSocialProfileRow = Database['public']['Tables']['influencer_social_profiles']['Row'];

const create_url_from_username = (username: string, platform: string) => {
    if (platform === 'youtube') {
        return `https://youtube.com/${username}`;
    }
    if (platform === 'instagram') {
        return `https://instagram.com/${username}`;
    }
    if (platform === 'tiktok') {
        return `https://tiktok.com/${username}`;
    }
};

export const getInfluencerById = async (id: string): Promise<influencerRow | null> => {
    const influencer = await supabase.from('influencers').select().match({
        id,
    });

    if (influencer.error) {
        throw influencer.error;
    }

    if (influencer.data.length <= 0) {
        return null;
    }

    return influencer.data[0];
};

// @todo we need to use the datasource user id instead of relying on the username+platform tuple
export const getInfluencerSocialProfileByReferenceId = async (
    referenceId: [string, string],
): Promise<influencerSocialProfileRow | null> => {
    const [username, platform] = referenceId;

    const socialProfile = await supabase
        .from('influencer_social_profiles')
        .select()
        .match({
            platform: platform,
            url: create_url_from_username(username, platform),
        });

    if (socialProfile.error) {
        throw socialProfile.error;
    }

    if (socialProfile.data.length <= 0) {
        return null;
    }

    return socialProfile.data[0];
};

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
