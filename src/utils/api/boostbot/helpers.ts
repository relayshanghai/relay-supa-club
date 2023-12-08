import type { ClassicSearchInfluencer } from 'pages/api/influencer-search';
import type { CreatorSearchAccountObject, CreatorSearchResult } from 'types';

export function flattenInfluencerData(influencersData: CreatorSearchResult) {
    if (!influencersData.accounts) return [];
    const structuredResults: ClassicSearchInfluencer[] = influencersData.accounts.map(
        (creator: CreatorSearchAccountObject) => ({
            ...creator.account?.user_profile,
            ...creator.match?.user_profile,
            ...creator.match?.audience_likers?.data,
            topics: ['alligators', 'monkeys'],
        }),
    );
    return {
        total: influencersData.total,
        influencers: structuredResults,
    };
}
