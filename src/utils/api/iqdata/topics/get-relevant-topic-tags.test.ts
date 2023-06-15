import { describe, it, expect } from 'vitest';
import { getRelevantTopicTags } from './get-relevant-topic-tags';

describe('Get Relevant Topic Tags', () => {
    it('Get relevant topics', async () => {
        const response = await getRelevantTopicTags({
            query: {
                q: 'dogs',
            },
        });

        expect(response.success).toBe(true);
        expect(response.data.length).toEqual(60);
    });
});
