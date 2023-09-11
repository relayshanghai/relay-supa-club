import { type SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { getInfluencerSocialProfileByIdCall as getInfluencerSocialProfileById } from 'src/utils/api/db/calls/influencers';
import {
    getSequenceInfluencerByIdCall,
    getSequenceInfluencersBySequenceIdCall as getSequenceInfluencersBySequenceId,
} from 'src/utils/api/db/calls/sequence-influencers';
import type { RelayDatabase, SequenceInfluencersTable } from '../types';
import { getAddressByInfluencer } from './addresses';
import { getProfileByIdCall as getProfileById } from './profiles';

// @note gets sequence influencers by sequence
export const getSequenceInfluencers = (db: RelayDatabase) => async (sequenceId: string) => {
    const influencers = await getSequenceInfluencersBySequenceId(db)(sequenceId);
    const queries = influencers.map(getSequenceInfluencer(db));

    return Promise.all(queries);
};

export const getSequenceInfluencer =
    (db: RelayDatabase) =>
    async (id: string | SequenceInfluencersTable['Row']): Promise<SequenceInfluencerManagerPage> => {
        const sequenceInfluencer = typeof id === 'string' ? await getSequenceInfluencerByIdCall(db)(id) : id;

        const { data: manager } = await getProfileById(db)(sequenceInfluencer.added_by);

        const influencer = await getInfluencerSocialProfileById(db)(sequenceInfluencer.influencer_social_profile_id);

        const address = await getAddressByInfluencer(db)(sequenceInfluencer.influencer_social_profile_id);

        if (!manager || !influencer) {
            throw new Error('Sequence influencer not found');
        }

        return {
            ...sequenceInfluencer,
            iqdata_id: influencer.reference_id.replace('iqdata:', ''),
            influencer_id: influencer.id,
            manager_first_name: manager?.first_name ?? '',
            name: influencer.name,
            username: influencer.username,
            avatar_url: influencer.avatar_url,
            url: influencer.url,
            platform: influencer.platform,
            address,
            manager: {
                id: manager.id,
                avatar_url: manager.avatar_url,
                company_id: manager.company_id,
                first_name: manager.first_name,
                last_name: manager.last_name,
            },
        };
    };
