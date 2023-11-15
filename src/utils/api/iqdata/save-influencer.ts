import type { CreatorReport } from 'types';
import {
    insertInfluencer as insertInfluencerToDb,
    insertInfluencerSocialProfile as insertInfluencerSocialProfileToDb,
    getInfluencerSocialProfileByReferenceId,
    getInfluencerById,
    updateInfluencerSocialProfile,
} from '../db/calls/influencers-insert';
import {
    extractInfluencerReferenceId,
    mapIqdataProfileToInfluencer,
    mapIqdataProfileToInfluencerSocialProfile,
} from './extract-influencer';
import { compose } from '../../compose';
import type { InfluencerRow, InfluencerSocialProfileRow, RelayDatabase } from '../db';

const addInfluencerToSocialProfile = (influencer: InfluencerRow) => {
    return (user_profile: CreatorReport['user_profile']) => {
        return { ...user_profile, influencer_id: influencer.id };
    };
};

const insertSocialProfileFromIqdataProfile = (db: RelayDatabase) => (user_profile: CreatorReport['user_profile']) => {
    return async (getInfluencer: Promise<InfluencerRow>): Promise<[InfluencerRow, InfluencerSocialProfileRow]> => {
        const influencer = await getInfluencer;

        const insertInfluencerSocialProfileToDbFromIqdataProfile = compose(
            insertInfluencerSocialProfileToDb(db),
            addInfluencerToSocialProfile(influencer),
            mapIqdataProfileToInfluencerSocialProfile,
        );
        const socialProfile = await insertInfluencerSocialProfileToDbFromIqdataProfile(user_profile);
        return [influencer, socialProfile];
    };
};

export const saveInfluencer =
    (db: RelayDatabase) =>
    async (data: CreatorReport): Promise<[InfluencerRow, InfluencerSocialProfileRow] | [null, null]> => {
        const referenceId = extractInfluencerReferenceId(data['user_profile']);
        const existingSocialProfileGet = await getInfluencerSocialProfileByReferenceId(db)(referenceId);
        let existingInfluencer = null;
        const existingSocialProfile = existingSocialProfileGet?.data;

        if (existingSocialProfile) {
            existingInfluencer = await getInfluencerById(db)(existingSocialProfile.influencer_id);
        }

        if (existingInfluencer && existingSocialProfile) {
            const updatedSocialProfile = await updateInfluencerSocialProfile(db)(
                existingSocialProfile.id,
                mapIqdataProfileToInfluencerSocialProfile(data['user_profile']),
            );

            return [existingInfluencer, updatedSocialProfile];
        }

        const insertInfluencerFromIqdataProfile = compose(
            insertSocialProfileFromIqdataProfile(db)(data.user_profile),
            insertInfluencerToDb(db),
            mapIqdataProfileToInfluencer,
        );
        const [influencer, socialProfile] = await insertInfluencerFromIqdataProfile(data.user_profile);

        if (influencer === null) return [null, null];

        return [influencer, socialProfile];
    };
