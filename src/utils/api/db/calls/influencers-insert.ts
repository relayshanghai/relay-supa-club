// @note: separate this from influencers.ts for now
//        since `src/utils/supabase-client` is automatically loading supabase service_key
//        and we cannot use these queries in the frontend
import type { SupabaseClient } from '@supabase/supabase-js';
import type {
    InfluencerRow,
    InfluencerSocialProfileRow,
    InfluencerInsert,
    InfluencerSocialProfileInsert,
    InfluencerContactInsert,
    InfluencerContactRow,
} from '../types';
import type { Database } from 'types/supabase';

export const insertInfluencer =
    (db: SupabaseClient<Database>) =>
    async (data: InfluencerInsert): Promise<InfluencerRow> => {
        const influencer = await db.from('influencers').insert(data).select();

        if (influencer.error) {
            throw influencer.error;
        }

        return influencer.data[0];
    };

export const insertInfluencerSocialProfile =
    (db: SupabaseClient<Database>) =>
    async (data: InfluencerSocialProfileInsert): Promise<InfluencerSocialProfileRow> => {
        const socialProfile = await db.from('influencer_social_profiles').insert(data).select();
        if (socialProfile.error) {
            throw socialProfile.error;
        }

        return socialProfile.data[0];
    };

export const insertInfluencerContact =
    (db: SupabaseClient<Database>) =>
    async (data: InfluencerContactInsert): Promise<InfluencerContactRow> => {
        const contact = await db.from('influencer_contacts').insert(data).select();

        if (contact.error) {
            throw contact.error;
        }

        return contact.data[0];
    };
