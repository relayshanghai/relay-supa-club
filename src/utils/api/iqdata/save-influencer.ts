import type { CreatorReport } from 'types';
import type { InfluencerRow, InfluencerSocialProfileRow } from '../db/calls/influencers';
import {
    insertInfluencer as insertInfluencerToDb,
    insertInfluencerSocialProfile as insertInfluencerSocialProfileToDb,
} from '../db/calls/influencers';
import { mapIqdataProfileToInfluencer, mapIqdataProfileToInfluencerSocialProfile } from './extract-influencer';
import { compose } from '../../compose';

const addInfluencerToSocialProfile = (influencer: InfluencerRow) => {
    return (user_profile: CreatorReport['user_profile']) => {
        return { ...user_profile, influencer_id: influencer.id };
    };
};

const insertSocialProfileFromIqdataProfile = (user_profile: CreatorReport['user_profile']) => {
    return async (influencer: InfluencerRow): Promise<[InfluencerRow, InfluencerSocialProfileRow]> => {
        const insertInfluencerSocialProfileToDbFromIqdataProfile = compose(
            insertInfluencerSocialProfileToDb,
            addInfluencerToSocialProfile(influencer),
            mapIqdataProfileToInfluencerSocialProfile,
        );
        const socialProfile = await insertInfluencerSocialProfileToDbFromIqdataProfile(user_profile);
        return [influencer, socialProfile];
    };
};

const insertInfluencerFromIqdataProfile = (user_profile: CreatorReport['user_profile']) =>
    compose(
        insertSocialProfileFromIqdataProfile(user_profile),
        insertInfluencerToDb,
        mapIqdataProfileToInfluencer,
    )(user_profile);

/**
 * Saves an influencer to the database.
 * @async
 * @param {CreatorReport} data - The creator report data.
 * @returns {Promise<[InfluencerRow, InfluencerSocialProfileRow] | [null, null]>} - A promise that resolves with an array of two elements.
 * The first element is either an influencer row object or null if the insert fails.
 * The second element is an influencer social profile row object or null if the insert fails.
 */
export const saveInfluencer = async (
    data: CreatorReport,
): Promise<[InfluencerRow, InfluencerSocialProfileRow] | [null, null]> => {
    const [influencer, socialProfile] = await insertInfluencerFromIqdataProfile(data.user_profile);

    if (influencer === null) return [null, null];

    return [influencer, socialProfile];
};
