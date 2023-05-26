import type { SupabaseClient } from '@supabase/supabase-js';
import { insertInfluencerPost } from './api/db/calls/influencer-post';
import type { DatabaseWithCustomTypes } from 'types';
import { extractPlatformFromURL } from './extract-platform-from-url';

export type SaveInfluencerPostData = {
    type: string;
    campaign_id: string;
    influencer_social_profile_id: string;
    url: string;
    title?: string;
    description?: string;
    preview_url?: string;
};

export const saveInfluencerPost =
    (db: SupabaseClient<DatabaseWithCustomTypes>) => async (data: SaveInfluencerPostData) => {
        const platform = extractPlatformFromURL(data.url) || '';

        return await insertInfluencerPost(db)({ ...data, platform });
    };
