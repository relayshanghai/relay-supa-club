import { type SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import {
    getSequenceInfluencerByIdCall,
    getSequenceInfluencersBySequenceIdsCall,
} from 'src/utils/api/db/calls/sequence-influencers';
import type { RelayDatabase, SequenceInfluencersTable } from '../types';
import { serverLogger } from 'src/utils/logger-server';

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
                    manager_first_name: '',
                    recent_post_title: socialProfile?.recent_post_title ?? '',
                    recent_post_url: socialProfile?.recent_post_url ?? '',
                });
            });
            // add the manager first name to each influencer if their added_by id matches a manager id:
            results.forEach((influencer) => {
                const manager = managers.find((manager) => manager.id === influencer.added_by);
                if (manager) {
                    influencer.manager_first_name = manager.first_name;
                }
            });
        }

        return results;
    };

/**
 * Note that this does not return the manager first name, recent post title, or recent post url
 */
export const getSequenceInfluencer =
    (db: RelayDatabase) =>
    async (id: string | SequenceInfluencersTable['Row']): Promise<SequenceInfluencerManagerPage> => {
        const sequenceInfluencer = typeof id === 'string' ? await getSequenceInfluencerByIdCall(db)(id) : id;

        const { data, error } = await db
            .from('sequence_influencers')
            .select('*, address: addresses (*)')
            .eq('id', sequenceInfluencer.id)
            .single();

        if (error) {
            serverLogger(error);
            throw error;
        }
        return {
            ...data,
            manager_first_name: '',
            recent_post_title: '',
            recent_post_url: '',
        };
    };

export const getManagerNames = (db: RelayDatabase) => async (managerIds: string[]) => {
    return db.from('profiles').select('first_name').in('id', managerIds);
};
