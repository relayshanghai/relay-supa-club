import { serverLogger } from 'src/utils/logger-server';
import type {
    Addresses,
    InfluencerSocialProfileRow,
    RelayDatabase,
    SequenceInfluencer,
    SequenceInfluencerInsert,
    SequenceInfluencerUpdate,
} from '../types';
import type { SequenceInfluencerManagerPageWithChannelData } from 'pages/api/sequence/influencers';
import type { SearchTableInfluencer } from 'types';

const sequenceInfluencerSocialProfileAndAddressJoinQuery =
    '*, socialProfile: influencer_social_profiles (recent_post_title, recent_post_url, avatar_url, url, username, name, data), address: addresses (*)';

const unpackSocialProfile = (
    influencer: SequenceInfluencer & {
        socialProfile: Pick<
            InfluencerSocialProfileRow,
            'recent_post_title' | 'recent_post_url' | 'avatar_url' | 'url' | 'username' | 'name' | 'data'
        > | null;
        address: Addresses['Row'] | null;
    },
): SequenceInfluencerManagerPageWithChannelData => {
    const { socialProfile, ...rest } = influencer;
    return {
        ...rest,
        manager_first_name: '',
        recent_post_title: socialProfile?.recent_post_title ?? '',
        recent_post_url: socialProfile?.recent_post_url ?? '',
        avatar_url: socialProfile?.avatar_url ?? rest.avatar_url,
        url: socialProfile?.url ?? rest.url,
        username: socialProfile?.username ?? rest.username,
        name: socialProfile?.name ?? rest.name,
        channel_data: socialProfile?.data as unknown as SearchTableInfluencer,
    };
};
/**
 * Note this does not return the manager first name. only getSequenceInfluencers() in `get-sequence-influencers.ts` does that
 */
export const getSequenceInfluencerByIdCall =
    (supabaseClient: RelayDatabase) =>
    async (id: string): Promise<SequenceInfluencerManagerPageWithChannelData> => {
        if (!id) {
            throw new Error('No id provided');
        }
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .select(sequenceInfluencerSocialProfileAndAddressJoinQuery)
            .eq('id', id)
            .single();

        if (error) throw error;
        return unpackSocialProfile(data);
    };

export const getSequenceInfluencersBySequenceIdCall =
    (supabaseClient: RelayDatabase) =>
    async (sequenceId: string): Promise<SequenceInfluencerManagerPageWithChannelData[]> => {
        if (!sequenceId) {
            throw new Error('No sequenceId provided');
        }
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .select(sequenceInfluencerSocialProfileAndAddressJoinQuery)
            .eq('sequence_id', sequenceId);
        if (error) throw error;

        return data?.map(unpackSocialProfile);
    };

export const getSequenceInfluencersBySequenceIdsCall =
    (supabaseClient: RelayDatabase) =>
    async (sequenceIds: string[]): Promise<SequenceInfluencerManagerPageWithChannelData[]> => {
        if (!sequenceIds) {
            throw new Error('No sequenceIds provided');
        }
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .select(sequenceInfluencerSocialProfileAndAddressJoinQuery)
            .in('sequence_id', sequenceIds);

        if (error) throw error;
        return data?.map(unpackSocialProfile);
    };

export const getSequenceInfluencersCountByCompanyIdCall =
    (supabaseClient: RelayDatabase) => async (companyId: string) => {
        const { error, count } = await supabaseClient
            .from('sequence_influencers')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', companyId);
        if (error) throw error;
        if (!count) return 0;
        return count;
    };

export const getSequenceInfluencersIqDataIdAndSequenceNameByCompanyIdCall =
    (supabaseClient: RelayDatabase) => async (companyId: string) => {
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .select('id, iqdata_id, email, sequences(name)')
            .eq('company_id', companyId);

        if (error) throw error;
        return data;
    };

export const getSequenceInfluencerByEmailAndCompanyCall =
    (supabaseClient: RelayDatabase) =>
    async (email: string, companyId?: string | null): Promise<SequenceInfluencerManagerPageWithChannelData> => {
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .select(sequenceInfluencerSocialProfileAndAddressJoinQuery)
            .limit(1)
            .match({ email, company_id: companyId })
            .single();
        if (error) throw error;
        return unpackSocialProfile(data);
    };

export const upsertSequenceInfluencersFunnelStatusCall =
    (supabaseClient: RelayDatabase) => async (influencers: SequenceInfluencerInsert[]) => {
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .upsert(influencers, { ignoreDuplicates: false })
            .select();

        if (error) throw error;
        return data;
    };

/**
 * If updating the email, also pass in the company_id so we can check if the email already exists for this company
 */
export const updateSequenceInfluencerCall =
    (supabaseClient: RelayDatabase) =>
    async (update: SequenceInfluencerUpdate): Promise<SequenceInfluencerManagerPageWithChannelData> => {
        if (Object.keys(update).includes('platform') && !update.platform) {
            serverLogger(`strange update ${update}`);
        }
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .update(update)
            .eq('id', update.id)
            .select(sequenceInfluencerSocialProfileAndAddressJoinQuery)
            .single();
        if (error) throw error;
        return unpackSocialProfile(data);
    };

export const createSequenceInfluencerCall =
    (supabaseClient: RelayDatabase) => async (sequenceInfluencer: SequenceInfluencerInsert) => {
        if (!sequenceInfluencer.company_id) {
            throw new Error('No company id provided');
        }
        if (!sequenceInfluencer.iqdata_id) {
            throw new Error('No iqdata id provided');
        }
        const { data: existingIqdata } = await supabaseClient
            .from('sequence_influencers')
            .select('iqdata_id, company_id, email')
            .match({ iqdata_id: sequenceInfluencer.iqdata_id, company_id: sequenceInfluencer.company_id });
        if (existingIqdata && existingIqdata.length > 0) {
            throw new Error('Influencer already exists for this company');
        }
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .insert(sequenceInfluencer)
            .select()
            .single();
        if (error) throw error;
        return data;
    };

export const deleteSequenceInfluencersCall = (supabaseClient: RelayDatabase) => async (ids: string[]) => {
    const { error } = await supabaseClient.from('sequence_influencers').delete().in('id', ids);
    if (error) throw error;
};
