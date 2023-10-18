import { type SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { getInfluencerSocialProfileByIdCall as getInfluencerSocialProfileById } from 'src/utils/api/db/calls/influencers';
import {
    getSequenceInfluencerByIdCall,
    getSequenceInfluencersBySequenceIdCall as getSequenceInfluencersBySequenceId,
} from 'src/utils/api/db/calls/sequence-influencers';
import type { Addresses, InfluencerSocialProfileRow, RelayDatabase, SequenceInfluencersTable } from '../types';
import { getAddressByInfluencer } from './addresses';
import { getProfileByIdCall as getProfileById } from './profiles';
import { serverLogger } from 'src/utils/logger-server';
import type { CreatorPlatform } from 'types';

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
        let socialProfile: Partial<InfluencerSocialProfileRow> = {
            name: sequenceInfluencer.name,
            username: sequenceInfluencer.username ?? '',
            avatar_url: sequenceInfluencer.avatar_url,
            url: sequenceInfluencer.url ?? '',
            platform: sequenceInfluencer.platform ?? '',
        };
        let address: Addresses['Row'] | null = null;
        if (sequenceInfluencer.influencer_social_profile_id) {
            try {
                if (!sequenceInfluencer.name || !sequenceInfluencer.username) {
                    // name, username, avatar_url, url, platform are now all filled in at sequence influencer creation
                    // So this should only be called for old sequence influencers
                    socialProfile = await getInfluencerSocialProfileById(db)(
                        sequenceInfluencer.influencer_social_profile_id,
                    );
                }
                address = await getAddressByInfluencer(db)(sequenceInfluencer.influencer_social_profile_id);
            } catch (error) {
                serverLogger(error);
            }
        }

        return {
            ...sequenceInfluencer,
            manager_first_name: manager?.first_name ?? '',
            name: socialProfile?.name ?? '',
            username: socialProfile?.username ?? '',
            avatar_url: socialProfile?.avatar_url ?? '',
            url: socialProfile?.url ?? '',
            platform: (socialProfile?.platform as CreatorPlatform) ?? 'youtube',
            address,
            manager: {
                id: manager?.id ?? '',
                avatar_url: manager?.avatar_url ?? '',
                company_id: manager?.company_id ?? '',
                first_name: manager?.first_name ?? '',
                last_name: manager?.last_name ?? '',
            },
        };
    };
