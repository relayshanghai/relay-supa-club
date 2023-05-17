import type { SupabaseClient } from '@supabase/supabase-js';
import { insertInfluencerPost } from './api/db/calls/influencer-post';
import type { DatabaseWithCustomTypes } from 'types';

export type SaveInfluencerPostData = {
    type: string;
    campaign_id: string;
    influencer_id: string;
    url: string;
};

export const extractPlatformFromURL = (url: string): string | null => {
    try {
        const tokens = new URL(url).hostname.split('.');
        const platforms = ['youtube', 'instagram', 'tiktok'];
        return platforms.find((v: string) => tokens.indexOf(v) !== -1) || null;
    } catch {
        return null;
    }
};

export const saveInfluencerPost =
    (db: SupabaseClient<DatabaseWithCustomTypes>) => async (data: SaveInfluencerPostData) => {
        const platform = extractPlatformFromURL(data.url) || '';

        return await insertInfluencerPost(db)({ ...data, platform });
    };
