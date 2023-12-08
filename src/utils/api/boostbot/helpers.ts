import type { CreatorSearchAccountObject, CreatorSearchResult, SearchTableInfluencer } from 'types';

export function flattenInfluencerData(influencersData: CreatorSearchResult, topics: string[] = []) {
    if (!influencersData.accounts)
        return {
            total: 0,
            influencers: [],
        };
    const structuredResults: SearchTableInfluencer[] = influencersData.accounts
        .map((creator: CreatorSearchAccountObject) => ({
            ...creator.account?.user_profile,
            ...creator.match?.user_profile,
            ...creator.match?.audience_likers?.data,
            topics,
        }))
        .flat();
    return {
        total: influencersData.total,
        influencers: structuredResults,
    };
}
