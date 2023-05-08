import { vi, describe, it, expect } from 'vitest';
import * as influencersModule from './api/db/calls/influencers';
import { getInfluencerByReferenceId } from './get-influencer';
import type { CreatorReport } from 'types';

describe('Get influencer', () => {
    it('Get influencer', async () => {
        const socialProfileData = {
            id: '2',
            influencer_id: '1',
            platform: 'youtube',
            url: 'https://youtube.com/johndoe',
            reference_id: 'iqdata:abc123',
            created_at: null,
        } as unknown as influencersModule.InfluencerSocialProfileRow;

        const influencerData = {
            id: '1',
            name: 'John Doe',
        } as unknown as influencersModule.InfluencerRow;

        const report = {
            user_profile: {
                user_id: 'abc123',
            },
        } as unknown as CreatorReport;

        const getInfluencerSocialProfileByReferenceIdSpy = vi
            .spyOn(influencersModule, 'getInfluencerSocialProfileByReferenceId')
            .mockResolvedValue(socialProfileData);

        const getInfluencerByIdSpy = vi.spyOn(influencersModule, 'getInfluencerById').mockResolvedValue(influencerData);

        const [influencer, socialProfile] = await getInfluencerByReferenceId(report);

        expect(influencer).not.toBeNull();
        expect(socialProfile).not.toBeNull();

        expect(getInfluencerSocialProfileByReferenceIdSpy).toHaveBeenCalledTimes(1);
        expect(getInfluencerByIdSpy).toHaveBeenCalledTimes(1);

        if (influencer && socialProfile) {
            expect(influencer.name).toBe('John Doe');
            expect(socialProfile.influencer_id).toBe('1');
            expect(socialProfile.id).toBe('2');
        }
    });

    it('Get no influencer', async () => {
        const report = {
            user_profile: {
                user_id: 'abc123',
            },
        } as unknown as CreatorReport;

        const getInfluencerSocialProfileByReferenceIdSpy = vi
            .spyOn(influencersModule, 'getInfluencerSocialProfileByReferenceId')
            .mockResolvedValue(null);

        const getInfluencerByIdSpy = vi.spyOn(influencersModule, 'getInfluencerById').mockResolvedValue(null);

        const [influencer, socialProfile] = await getInfluencerByReferenceId(report);

        expect(getInfluencerSocialProfileByReferenceIdSpy).toHaveBeenCalledTimes(1);
        expect(getInfluencerByIdSpy).toHaveBeenCalledTimes(0);

        expect(influencer).toBeNull();
        expect(socialProfile).toBeNull();
    });
});
