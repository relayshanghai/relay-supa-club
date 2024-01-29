import { db } from 'src/utils/supabase-client';
import { insertInfluencers, upsertInfluencerProfiles } from 'src/utils/api/db/calls/influencers-insert';
import type { SearchTableInfluencer } from 'types';
import type { TopicsAndRelevance } from './get-topic-relevance';
import { transformInfluencerToSocialProfile } from './helper';

export type SavedSearchTableInfluencer = SearchTableInfluencer & {
    influencer_niche_graph?: TopicsAndRelevance[];
};

export const saveSearchResultsDbCall = async (influencers: SavedSearchTableInfluencer[]) => {
    const influencersToInsert = influencers.map(({ picture, fullname, username, handle, custom_name }) => ({
        avatar_url: picture,
        name: fullname || username || handle || custom_name || '',
    }));

    const insertedInfluencers = await db(insertInfluencers)(influencersToInsert);

    const socialProfilesToInsert = influencers.map((i, index) =>
        transformInfluencerToSocialProfile(i, insertedInfluencers[index].id),
    );

    db(upsertInfluencerProfiles)(socialProfilesToInsert);
};
