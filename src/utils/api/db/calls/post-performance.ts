import { supabase } from 'src/utils/supabase-client';
import { getProfileById } from './profiles';
import type { PostsPerformance, PostsPerformanceInsert, PostsPerformanceUpdate } from '../types';
import type { CreatorPlatform, DatabaseWithCustomTypes } from 'types';
import type { SupabaseClient } from '@supabase/supabase-js';

export type PostPerformanceAndPost = PostsPerformanceUpdate & {
    platform: CreatorPlatform;
    url: string;
};

export const getPostsPerformance = async (id: string) => {
    const { data, error } = await supabase
        .from('posts_performance')
        .select('*, influencer_posts(platform, url)')
        .eq('id', id);
    if (!data || !data[0]) {
        throw new Error('Post performance not found');
    }
    const { influencer_posts, ...postPerformance } = data[0];
    const influencerPost = influencer_posts as unknown as {
        platform: CreatorPlatform;
        url: string;
    };

    const merged: PostPerformanceAndPost = {
        ...postPerformance,
        ...influencerPost,
    };

    if (error) throw error;
    return merged;
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
    const posts: PostPerformanceAndPost[] = [];
    data?.forEach(({ influencer_posts, ...postPerformance }) => {
        const influencerPost = influencer_posts as unknown as {
            platform: CreatorPlatform;
            url: string;
        };
        if (!influencerPost || !influencerPost.url || !influencerPost.platform) {
            throw new Error('Invalid post data. Post performance does not have linked post');
        }
        posts.push({
            ...postPerformance,
            ...influencerPost,
        });
    });

    if (error) throw error;
    return posts;
};

export const updatePostPerformance = async (data: PostsPerformanceUpdate) => {
    const { id, ...update } = data;
    update.updated_at = new Date().toISOString();
    const { error } = await supabase.from('posts_performance').update(update).eq('id', id).single();
    if (error) throw error;
    return data;
};

export const insertPostPerformance =
    (db: SupabaseClient<DatabaseWithCustomTypes>) =>
    async (data: PostsPerformanceInsert): Promise<PostsPerformance> => {
        data.created_at = new Date().toISOString();

        const response = await db.from('posts_performance').insert(data).select().single();

        if (response.error) {
            throw response.error;
        }

        return response.data;
    };
