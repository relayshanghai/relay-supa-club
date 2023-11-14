import type { SearchInfluencersPayloadRequired } from 'src/utils/api/iqdata/influencers/search-influencers-payload';
import type { CreatorPlatform, InfluencerSize } from 'types';
import { countriesByCode } from 'src/utils/api/iqdata/dictionaries/geolocations';
import { isDev } from 'src/constants';
import type { Filters } from 'src/components/boostbot/chat';

export const createBoostbotInfluencerPayload = ({
    platform,
    filters,
    topics,
}: {
    platform: CreatorPlatform;
    filters: Filters;
    topics: string | string[];
}): SearchInfluencersPayloadRequired => {
    if (Array.isArray(topics)) topics = topics.join(', ');

    const reelsPlaysParam = platform === 'instagram' ? { left_number: 0 } : undefined;
    const followerLimits = {
        youtube: {
            microinfluencer: { left_number: 1000, right_number: 75000 },
            nicheinfluencer: { left_number: 75000, right_number: 350000 },
            megainfluencer: { left_number: 350000, right_number: undefined },
        },
        instagram: {
            microinfluencer: { left_number: 5000, right_number: 50000 },
            nicheinfluencer: { left_number: 50000, right_number: 500000 },
            megainfluencer: { left_number: 500000, right_number: undefined },
        },
        tiktok: {
            microinfluencer: { left_number: 5000, right_number: 50000 },
            nicheinfluencer: { left_number: 50000, right_number: 750000 },
            megainfluencer: { left_number: 750000, right_number: undefined },
        },
    };
    const { influencerSizes, ...restOfFilters } = filters;

    const getFollowerParams = (
        platform: CreatorPlatform,
        influencerSizes: InfluencerSize[],
    ): { left_number: number; right_number: number | undefined } => {
        const platformLimits = followerLimits[platform];

        let minFollowers = Infinity;
        let maxFollowers = 0;

        for (const size of influencerSizes) {
            const { left_number, right_number } = platformLimits[size];
            minFollowers = Math.min(minFollowers, left_number);
            maxFollowers = right_number === undefined ? Infinity : Math.max(maxFollowers, right_number);
        }

        return {
            left_number: minFollowers,
            right_number: maxFollowers === Infinity ? undefined : maxFollowers,
        };
    };

    return {
        query: { auto_unhide: isDev() ? 0 : 1, platform },
        body: {
            paging: { limit: 100 },
            filter: {
                lang: { code: 'en' },
                relevance: { value: topics },
                actions: [{ filter: 'relevance', action: 'must' }],
                engagement_rate: { value: 0.01, operator: 'gt' },
                followers: getFollowerParams(platform, influencerSizes),
                last_posted: 30,
                geo: [{ id: countriesByCode.US.id }, { id: countriesByCode.CA.id }],
                with_contact: [{ type: 'email' }],
                followers_growth: {
                    interval: 'i1month',
                    operator: 'gte',
                    value: 0,
                },
                posts_count: {
                    left_number: 0,
                },
                audience_gender: {
                    code: 'MALE',
                    weight: 0,
                },
                reels_plays: reelsPlaysParam,
                ...restOfFilters,
            },
            sort: { field: 'relevance', direction: 'desc' },
            audience_source: 'any',
        },
    };
};
