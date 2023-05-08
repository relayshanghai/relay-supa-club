import { vi, describe, it, expect } from 'vitest';
import { insertInfluencer, insertInfluencerSocialProfile } from './api/db/calls/influencers';
import * as extractInfluencer from './api/iqdata/extract-influencer';
import type { CreatorReport } from 'types';
import { saveInfluencer } from './save-influencer';

vi.mock('./api/db/calls/influencers', () => ({
    insertInfluencer: vi.fn((_: any) => {
        return { ..._, id: 1 };
    }),
    insertInfluencerSocialProfile: vi.fn((_: any) => {
        return { ..._, id: 2 };
    }),
}));

describe('Save influencer', () => {
    it('Save influencer', async () => {
        const data = {
            user_profile: {
                user_id: 'abc123',
                fullname: 'John Doe',
                contacts: [{ type: 'email', value: 'john.doe@email.com' }],
                avatar_url: 'https://image.com/john+doe.jpg',
            },
        } as unknown as CreatorReport;

        const extractInfluencerSocialProfileSpy = vi.spyOn(
            extractInfluencer,
            'mapIqdataProfileToInfluencerSocialProfile',
        );
        const extractInfluencerSpy = vi.spyOn(extractInfluencer, 'mapIqdataProfileToInfluencer');
        const [influencer, socialProfile] = await saveInfluencer(data);

        expect(influencer).not.toBeNull();
        expect(socialProfile).not.toBeNull();

        expect(insertInfluencer).toHaveBeenCalledTimes(1);
        expect(insertInfluencerSocialProfile).toHaveBeenCalledTimes(1);

        expect(extractInfluencerSpy).toHaveBeenCalledTimes(1);
        expect(extractInfluencerSocialProfileSpy).toHaveBeenCalledTimes(1);

        if (influencer && socialProfile) {
            expect(influencer.id).toBe(1);
            expect(influencer.name).toBe('John Doe');
            expect(socialProfile.influencer_id).toBe(1);
        }
    });
});
