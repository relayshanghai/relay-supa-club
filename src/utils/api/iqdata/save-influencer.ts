import type { CreatorReport } from 'types';
import {
    insertInfluencer as insertInfluencerToDb,
    insertInfluencerSocialProfile as insertInfluencerSocialProfileToDb,
} from '../db/calls/influencers-insert';
import { mapIqdataProfileToInfluencer, mapIqdataProfileToInfluencerSocialProfile } from './extract-influencer';
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
        const insertInfluencerFromIqdataProfile = compose(
            insertSocialProfileFromIqdataProfile(db)(data.user_profile),
            insertInfluencerToDb(db),
            mapIqdataProfileToInfluencer,
        );
        const [influencer, socialProfile] = await insertInfluencerFromIqdataProfile(data.user_profile);

        if (influencer === null) return [null, null];

        return [influencer, socialProfile];
    };
