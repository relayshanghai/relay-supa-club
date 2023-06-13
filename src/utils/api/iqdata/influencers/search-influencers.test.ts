import { describe, it, expect } from 'vitest';
import { searchInfluencers } from './search-influencers';

describe.skip('Search For Influencers', () => {
    it('Search without filters', async () => {
        const response = await searchInfluencers({});

        expect(response).toHaveProperty('accounts');
        expect(response).toHaveProperty('total');
        expect(response.accounts.length).toBeGreaterThan(1);
    }, 240000);

    it('Search with default filters', async () => {
        const response = await searchInfluencers({
            body: {
                filter: {
                    audience_geo: [
                        {
                            id: 148838,
                        },
                    ],
                    last_posted: 30,
                    with_contact: [
                        {
                            type: 'email',
                        },
                    ],
                },
                sort: {
                    field: 'engagements',
                },
                paging: {
                    limit: 3,
                },
            },
        });

        expect(response).toHaveProperty('accounts');
        expect(response).toHaveProperty('total');
        expect(response.accounts.length).toBeGreaterThan(1);
    }, 240000);

    it('Search with mixed filters', async () => {
        // expects ana-de-armas profile
        const response = await searchInfluencers({
            query: {
                platform: 'instagram',
            },
            body: {
                filter: {
                    text_tags: [{ type: 'hashtag', value: 'gregwilliamsphotography' }],
                    keywords: 'best actress oscar',
                },
                sort: {
                    field: 'keywords',
                },
                paging: {
                    limit: 5,
                },
            },
        });

        expect(response).toHaveProperty('accounts');
        expect(response).toHaveProperty('total');
        expect(response.accounts.length).toBeGreaterThan(1);
    }, 240000);
});
