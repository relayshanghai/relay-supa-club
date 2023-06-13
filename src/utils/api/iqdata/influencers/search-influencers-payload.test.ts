import { describe, it, expect } from 'vitest';
import { SearchInfluencersPayload } from './search-influencers-payload';

describe('Test SearchInfluencersPayload', () => {
    it('Should succeeed parsing ', async () => {
        const result = SearchInfluencersPayload.safeParse({});

        expect(result.success).toBe(true);
    });

    it('Should fail parsing', async () => {
        const result = SearchInfluencersPayload.safeParse({
            sort: {},
        });

        expect(result.success).toBe(false);
    });
});
