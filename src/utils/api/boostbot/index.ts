import type { SearchInfluencersPayload } from 'src/utils/api/iqdata/influencers/search-influencers-payload';

// Default Boostbot filters according to: https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/605
export const createBoostbotInfluencerPayload = (topics: string | string[]): SearchInfluencersPayload => {
    if (Array.isArray(topics)) topics = topics.join(', ');

    return {
        query: { auto_unhide: 0, platform: 'instagram' }, // TODO: handle other platforms
        body: {
            paging: { limit: 100 },
            filter: {
                lang: { code: 'en' },
                relevance: { value: topics },
                actions: [{ filter: 'relevance', action: 'must' }],
                engagement_rate: { value: 0.01, operator: 'gt' },
                followers: { left_number: 50000, right_number: 200000 },
                last_posted: 30,
                geo: [{ id: 148838 }],
                audience_geo: [{ id: 148838, weight: 0.2 }],
                with_contact: [{ type: 'email', action: 'should' }],
            },
            sort: { field: 'relevance', direction: 'desc' },
            audience_source: 'any',
        },
    };
};
