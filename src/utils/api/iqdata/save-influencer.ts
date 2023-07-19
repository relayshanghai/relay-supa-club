import type { CreatorReport, DatabaseWithCustomTypes } from 'types';
import {
    insertInfluencer as insertInfluencerToDb,
    insertInfluencerSocialProfile as insertInfluencerSocialProfileToDb,
    insertInfluencerContact as insertInfluencerContactToDb,
} from '../db/calls/influencers-insert';
import {
    mapIqdataProfileToInfluencer,
    mapIqdataProfileToInfluencerContacts,
    mapIqdataProfileToInfluencerSocialProfile,
} from './extract-influencer';
import { compose } from '../../compose';
import type { InfluencerContactRow, InfluencerRow, InfluencerSocialProfileRow } from '../db';
import type { SupabaseClient } from '@supabase/supabase-js';

const addInfluencerToSocialProfile = (influencer: InfluencerRow) => {
    return (user_profile: CreatorReport['user_profile']) => {
        return { ...user_profile, influencer_id: influencer.id };
    };
};

// TODO: this is tempt function, remove or combine it with the one above
const addInfluencerToContact = (influencer: InfluencerRow) => {
    return (user_profile: CreatorReport['user_profile']) => {
        return { ...user_profile, influencer_id: influencer.id };
    };
};

const insertSocialProfileFromIqdataProfile =
    (db: SupabaseClient<DatabaseWithCustomTypes>) => (user_profile: CreatorReport['user_profile']) => {
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

const insertInfluencerContactFromIqdataProfile =
    (db: SupabaseClient<DatabaseWithCustomTypes>) => (user_profile: CreatorReport['user_profile']) => {
        return async (getInfluencer: Promise<InfluencerRow>): Promise<[InfluencerRow, InfluencerContactRow]> => {
            const influencer = await getInfluencer;

            const insertInfluencerContactToDbFromIqdataProfile = compose(
                insertInfluencerContactToDb(db),
                addInfluencerToContact(influencer),
                mapIqdataProfileToInfluencerContacts,
            );
            const contact = await insertInfluencerContactToDbFromIqdataProfile(user_profile);

            return [influencer, contact];
        };
    };

export const saveInfluencer =
    (db: SupabaseClient<DatabaseWithCustomTypes>) =>
    async (data: CreatorReport): Promise<[InfluencerRow, InfluencerSocialProfileRow] | [null, null]> => {
        const insertInfluencerFromIqdataProfile = compose(
            insertSocialProfileFromIqdataProfile(db)(data.user_profile),
            insertInfluencerContactFromIqdataProfile(db)(data.user_profile),
            insertInfluencerToDb(db),
            mapIqdataProfileToInfluencer,
        );
        const [influencer, socialProfile] = await insertInfluencerFromIqdataProfile(data.user_profile);

        if (influencer === null) return [null, null];

        return [influencer, socialProfile];
    };
