// @note: separate this from influencers.ts for now
//        since `src/utils/supabase-client` is automatically loading supabase service_key
//        and we cannot use these queries in the frontend
import type { SupabaseClient } from '@supabase/supabase-js';
import type {
    InfluencerRow,
    InfluencerSocialProfileRow,
    InfluencerInsert,
    InfluencerSocialProfileInsert,
    RelayDatabase,
    InfluencerSocialProfilesTable,
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

export const getInfluencerById =
    (db: RelayDatabase) =>
    async (id: string): Promise<InfluencerRow | null> => {
        const influencer = await db
            .from('influencers')
            .select()
            .match({
                id,
            })
            .limit(1)
            .maybeSingle();

        if (influencer.error) {
            throw influencer.error;
        }

        return influencer.data;
    };

// @todo remove no-client version
export const getInfluencerSocialProfileByReferenceId = (db: RelayDatabase) => async (referenceId: string) => {
    return await db
        .from('influencer_social_profiles')
        .select()
        .match({
            reference_id: referenceId,
        })
        .maybeSingle();
};

export const updateInfluencerSocialProfile =
    (db: RelayDatabase) =>
    async (id: string, data: InfluencerSocialProfilesTable['Update']): Promise<InfluencerSocialProfileRow> => {
        const socialProfile = await db.from('influencer_social_profiles').update(data).eq('id', id).select().single();

        if (socialProfile.error) {
            throw socialProfile.error;
        }

        return socialProfile.data;
    };
