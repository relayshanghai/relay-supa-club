import { insertInfluencerPost } from './api/db/calls/influencer-post';
import { extractPlatformFromURL } from './extract-platform-from-url';
import type { RelayDatabase } from './api/db';

export type SaveInfluencerPostData = {
    type: string;
    campaign_id: string;
    influencer_social_profile_id: string;
    url: string;
    title?: string;
    description?: string;
    preview_url?: string;
    posted_date: string;
};

export const saveInfluencerPost = (db: RelayDatabase) => async (data: SaveInfluencerPostData) => {
    const platform = extractPlatformFromURL(data.url) || '';

    return await insertInfluencerPost(db)({ ...data, platform });
};
