import { insertInfluencerPost } from './api/db/calls/influencer-post';
import { extractPlatformFromURL } from './extract-platform-from-url';
import type { InfluencerPosts, RelayDatabase } from './api/db';

export type SaveInfluencerPostData = Omit<InfluencerPosts['Insert'], 'platform'> & { platform?: string };

export const saveInfluencerPost = (db: RelayDatabase) => async (data: SaveInfluencerPostData) => {
    const platform = extractPlatformFromURL(data.url) || '';

    return await insertInfluencerPost(db)({ ...data, platform });
};
