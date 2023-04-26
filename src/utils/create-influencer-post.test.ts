import { createInfluencerPost as _createInfluencerPost } from './api/db/calls/posts';
import { createInfluencerPost } from './create-influencer-post';

jest.mock('./api/db/calls/posts', () => ({
    createInfluencerPost: jest.fn((_) => {
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
