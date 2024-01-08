import { db } from 'src/utils/supabase-client';
import { insertInfluencers, upsertInfluencerProfiles } from 'src/utils/api/db/calls/influencers-insert';
import { extractPlatformFromURL } from 'src/utils/extract-platform-from-url';
import type { SearchTableInfluencer } from 'types';
import type { InfluencerSocialProfileInsert } from 'src/utils/api/db';
import type { Json } from 'types/supabase';

export const saveSearchResults = async (influencers: SearchTableInfluencer[]) => {
    const influencersToInsert = influencers.map((i) => ({
        avatar_url: i.picture,
        name: i.fullname || i.username || i.handle || i.custom_name || '',
    }));

    const insertedInfluencers = await db(insertInfluencers)(influencersToInsert);

    const socialProfilesToInsert = influencers.map((i, index) => ({
        avatar_url: i.picture,
        influencer_id: insertedInfluencers[index].id,
        reference_id: `iqdata:${i.user_id}`,
        name: i.fullname || i.username || i.handle || i.custom_name || '',
        platform: extractPlatformFromURL(i.url),
        url: i.url,
        username: i.username || i.handle || i.custom_name || '',
        data: i as unknown as Json,
    })) as InfluencerSocialProfileInsert[];

    db(upsertInfluencerProfiles)(socialProfilesToInsert);
};
