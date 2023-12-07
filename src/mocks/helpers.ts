export function flattenInfluencerData(influencersData: any) {
    if (!influencersData.accounts) return [];
    const structuredResults = influencersData.accounts.map((creator: any) => ({
        ...creator?.account?.user_profile,
        ...creator?.match?.user_profile,
        ...creator?.match?.audience_likers?.data,
        topics: [],
    }));
    return {
        total: influencersData.total,
        influencers: structuredResults,
    };
}
