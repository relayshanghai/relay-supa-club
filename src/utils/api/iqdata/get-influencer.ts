import type { CreatorReport } from 'types';
import { getInfluencerById, getInfluencerSocialProfileByReferenceId } from '../db/calls/influencers-no-client';
import { extractInfluencerReferenceId } from './extract-influencer';
import { compose } from '../../compose';
import type { InfluencerRow, InfluencerSocialProfileRow } from '../db';

type GetInfluencerReturn = [InfluencerRow, InfluencerSocialProfileRow] | [null, null];

const getInfluencerFromSocialProfile = async (
    getSocialProfile: Promise<InfluencerSocialProfileRow | null>,
): Promise<GetInfluencerReturn> => {
    const socialProfile = await getSocialProfile;
    if (socialProfile === null) {
        return [null, null];
    }

    const influencer = await getInfluencerById(socialProfile.influencer_id);

    if (influencer === null) {
        return [null, null];
    }

    return [influencer, socialProfile];
};

export const getInfluencer = async (data: CreatorReport): Promise<GetInfluencerReturn> => {
    const getInfluencerFromIqdataProfile = compose(
        getInfluencerFromSocialProfile,
        getInfluencerSocialProfileByReferenceId,
        extractInfluencerReferenceId,
    );
    return await getInfluencerFromIqdataProfile(data.user_profile);
};
