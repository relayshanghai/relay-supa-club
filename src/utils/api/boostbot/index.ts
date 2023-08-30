import type { SearchInfluencersPayload } from 'src/utils/api/iqdata/influencers/search-influencers-payload';
import type { CreatorPlatform } from 'types';

const isDev = () => process.env.NODE_ENV === 'development';

export const createBoostbotInfluencerPayload =
    (platform: CreatorPlatform) =>
    (topics: string | string[]): SearchInfluencersPayload => {
        if (Array.isArray(topics)) topics = topics.join(', ');
        const defaultFollowers = { left_number: 50000, right_number: 500000 };
        const youtubeFollowers = { left_number: 5000, right_number: 300000 };
        const followersParam = platform === 'youtube' ? youtubeFollowers : defaultFollowers;

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
                    geo: [{ id: 148838 }, { id: 1428125 }],
                    audience_geo: [
                        { id: 148838, weight: 0.15 },
                        { id: 1428125, weight: 0.1 },
                    ],
                    with_contact: [{ type: 'email' }],
                },
                sort: { field: 'relevance', direction: 'desc' },
                audience_source: 'any',
            },
        };
    };
