import { getInfluencerSocialProfileByIdCall as getInfluencerSocialProfileById } from '../../../../utils/api/db/calls/influencers';
import { getSequenceInfluencersBySequenceIdCall as getSequenceInfluencersBySequenceId } from '../../../../utils/api/db/calls/sequence-influencers';
import type { ServerContext } from '../../../../utils/api/iqdata';
import { type SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { getSequenceByIdCall } from './sequences';
import { db } from '../../../../utils/supabase-client';
import { serverLogger } from '../../../../utils/logger-server';

export const getSequenceInfluencers = async (ctx: ServerContext, sequenceId: string) => {
    const influencers = await db<typeof getSequenceInfluencersBySequenceId>(getSequenceInfluencersBySequenceId)(
        sequenceId,
    );

    const results: SequenceInfluencerManagerPage[] = [];

    for (const influencer of influencers) {
        try {
            const sequence = await db<typeof getSequenceByIdCall>(getSequenceByIdCall)(influencer.sequence_id);
            const influencerInfo = await db<typeof getInfluencerSocialProfileById>(getInfluencerSocialProfileById)(
                influencer.influencer_social_profile_id,
            );
            results.push({
                ...influencer,
                manager_first_name: sequence.manager_first_name || '',
                name: influencerInfo.name || influencerInfo.username,
                username: influencerInfo.username,
                avatar_url: influencerInfo.avatar_url,
                url: influencerInfo.url,
                platform: influencerInfo?.platform,
            });
        } catch (error) {
            serverLogger(error, 'error');
        }
    }
    return results;
};
