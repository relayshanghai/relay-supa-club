import { describe, it, expect } from 'vitest';
import { SearchInfluencersPayload } from './search-influencers-payload';

describe('Test SearchInfluencersPayload', () => {
    it('Should succeed parsing ', async () => {
        const result = SearchInfluencersPayload.passthrough().safeParse({});

        expect(result.success).toBe(true);
    });

    it('Should fail parsing', async () => {
        const result = SearchInfluencersPayload.passthrough().safeParse({
            body: {
                sort: {},
            },
        });

        expect(result.success).toBe(false);
    });
});
