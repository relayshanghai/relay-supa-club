import { supabase } from 'src/utils/supabase-client';
import { getProfileById } from './profiles';
import type { PostsPerformanceUpdate } from '../types';

export type PostPerformanceAndPost = PostsPerformanceUpdate & {
    influencer_posts: {
        platform: string;
        url: string;
    }[];
};

export const getPostsPerformancesByCampaign = async (
    campaignId: string,
    profileId: string,
): Promise<PostPerformanceAndPost[]> => {
    // check profile has access to campaign
    const { data: profile } = await getProfileById(profileId);
    if (!profile?.user_role) throw new Error('Profile not found');
    if (profile.user_role !== 'relay_employee') {
        const { data: campaign } = await supabase.from('campaigns').select().eq('id', campaignId).single();
        if (campaign?.company_id !== profile?.company_id) throw new Error('User does not have access to this campaign');
    }
    const { data, error } = await supabase
        .from('posts_performance')
        .select('*, influencer_posts(platform, url)')
        .eq('campaign_id', campaignId);

    if (error) throw error;
    return data as PostPerformanceAndPost[];
};

export const updatePostPerformance = async (data: PostsPerformanceUpdate) => {
    const { id, ...update } = data;
    update.updated_at = new Date().toISOString();
    const { error } = await supabase.from('posts_performance').update(update).eq('id', id).single();
    if (error) throw error;
    return data;
};
