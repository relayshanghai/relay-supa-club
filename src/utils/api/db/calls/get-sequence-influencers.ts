import { type SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import {
    getSequenceInfluencerByIdCall,
    getSequenceInfluencersBySequenceIdsCall,
} from 'src/utils/api/db/calls/sequence-influencers';
import type { RelayDatabase, SequenceInfluencersTable } from '../types';
import { serverLogger } from 'src/utils/logger-server';
import type { CreatorPlatform } from 'types';

/**
 * gets sequence influencers by sequence ids.
 * Gets the manager first name for each influencer and formats the return object to match the SequenceInfluencerManagerPage type
 */
export const getSequenceInfluencers =
    (db: RelayDatabase) =>
    async (sequenceIds: string[]): Promise<SequenceInfluencerManagerPage[]> => {
        const influencers = await getSequenceInfluencersBySequenceIdsCall(db)(sequenceIds);
        // add the manager first name to each influencer, making sure there aren't duplicate manager ids
        const managerIds = Array.from(new Set(influencers.map((influencer) => influencer.added_by)));

        const { data: managers, error } = await db.from('profiles').select('first_name, id').in('id', managerIds);

        const results: SequenceInfluencerManagerPage[] = [];
        if (error) {
            serverLogger(error);
        } else {
            // convert to SequenceInfluencerManagerPage format
            influencers.forEach((influencer) => {
                const { socialProfile, ...rest } = influencer;
                results.push({
                    ...rest,
                    manager_first_name:
                        managers.find((manager) => manager.id === influencer.added_by)?.first_name ?? '',
                    recent_post_title: socialProfile?.recent_post_title ?? '',
                });
            });
        }

        return results;
    };

export const getSequenceInfluencer =
    (db: RelayDatabase) =>
    async (id: string | SequenceInfluencersTable['Row']): Promise<SequenceInfluencerManagerPage> => {
        const sequenceInfluencer = typeof id === 'string' ? await getSequenceInfluencerByIdCall(db)(id) : id;

        const { data, error } = await db
            .from('sequence_influencers')
            .select(
                '*, socialProfile: influencer_social_profiles (name, username, avatar_url, url, platform), address: addresses (*)',
            )
            .eq('id', sequenceInfluencer.id)
            .single();

        if (error) {
            serverLogger(error);
            throw error;
        }
        return {
            ...data,
            manager_first_name: '',
            username: data.socialProfile?.username ?? '',
            avatar_url: data.socialProfile?.avatar_url ?? '',
            url: data.socialProfile?.url ?? '',
            platform: (data.socialProfile?.platform as CreatorPlatform) ?? 'youtube',
            address: data.address,
        };
    };

export const getManagerNames = (db: RelayDatabase) => async (managerIds: string[]) => {
    return db.from('profiles').select('first_name').in('id', managerIds);
};
