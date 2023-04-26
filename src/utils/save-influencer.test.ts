import { insertInfluencer, insertInfluencerProfile } from './api/db/calls/influencers';
import { extractInfluencer, extractInfluencerProfile } from './api/iqdata/extract-influencer';
import { saveInfluencer } from './save-influencer';

jest.mock('./api/db/calls/influencers', () => ({
    insertInfluencer: jest.fn((_: any) => {
        return { ..._, id: 1 };
    }),
    insertInfluencerProfile: jest.fn(),
}));

jest.mock('./api/iqdata/extract-influencer', () => ({
    extractInfluencer: jest.fn((v) => v),
    extractInfluencerProfile: jest.fn((_) => jest.fn()),
}));

describe('Save influencer', () => {
    it('Save influencer', async () => {
        const data = {
            user_profile: {
                fullname: 'John Doe',
                contacts: [{ type: 'email', value: 'john.doe@email.com' }],
                avatar_url: 'https://image.com/john+doe.jpg',
            },
        };

        const influencer = (await saveInfluencer(data)) as typeof data.user_profile & { id?: number };

        expect(insertInfluencer).toHaveBeenCalledTimes(1);
        expect(insertInfluencerProfile).toHaveBeenCalledTimes(1);

        expect(extractInfluencer).toHaveBeenCalledTimes(1);
        expect(extractInfluencerProfile).toHaveBeenCalledTimes(1);

        expect(influencer.id).toBe(1);
        expect(influencer.fullname).toBe('John Doe');
    });
});
