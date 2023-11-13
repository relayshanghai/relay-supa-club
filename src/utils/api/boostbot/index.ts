import type {
    SearchInfluencersPayloadRequired,
    filter,
} from 'src/utils/api/iqdata/influencers/search-influencers-payload';
import type { CreatorPlatform } from 'types';
import { countriesByCode } from 'src/utils/api/iqdata/dictionaries/geolocations';
import { isDev } from 'src/constants';

export const createBoostbotInfluencerPayload = ({
    platform,
    filters,
    topics,
}: {
    platform: CreatorPlatform;
    filters: filter;
    topics: string | string[];
}): SearchInfluencersPayloadRequired => {
    if (Array.isArray(topics)) topics = topics.join(', ');
    const defaultFollowers = { left_number: 50000, right_number: 500000 };
    const youtubeFollowers = { left_number: 5000, right_number: 300000 };
    const followersParam = platform === 'youtube' ? youtubeFollowers : defaultFollowers;
    const reelsPlaysParam = platform === 'instagram' ? { left_number: 0 } : undefined;

    return {
        query: { auto_unhide: isDev() ? 0 : 1, platform },
        body: {
            paging: { limit: 100 },
            filter: {
                lang: { code: 'en' },
                relevance: { value: topics },
                actions: [{ filter: 'relevance', action: 'must' }],
                engagement_rate: { value: 0.01, operator: 'gt' },
                followers: followersParam,
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
                ...filters,
            },
            sort: { field: 'relevance', direction: 'desc' },
            audience_source: 'any',
        },
    };
};
