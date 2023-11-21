import { type SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { getSequenceInfluencersBySequenceIdsCall } from 'src/utils/api/db/calls/sequence-influencers';
import type { RelayDatabase } from '../types';
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

        const results: SequenceInfluencerManagerPage[] = influencers;
        if (error) {
            serverLogger(error);
        } else {
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

export const getManagerNames = (db: RelayDatabase) => async (managerIds: string[]) => {
    return db.from('profiles').select('first_name').in('id', managerIds);
};
