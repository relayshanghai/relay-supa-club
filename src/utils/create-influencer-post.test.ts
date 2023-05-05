import { vi, describe, it, expect } from 'vitest';
import { createInfluencerPost as _createInfluencerPost } from './api/db/calls/posts';
import { createInfluencerPost } from './create-influencer-post';

vi.mock('./api/db/calls/posts', () => ({
    createInfluencerPost: vi.fn((_) => {
        return { ..._, id: 1 };
    }),
}));

describe('Create influencer post', () => {
    it('Create influencer post', async () => {
        const data = {
            post_id: '123abc',
        };

        const post = await createInfluencerPost(data);

        expect(_createInfluencerPost).toHaveBeenCalledTimes(1);

        expect(post.id).toBe(1);
        expect(post.post_id).toBe('123abc');
    });
});
