import { getInfluencerSocialProfileByIdCall as getInfluencerSocialProfileById } from 'src/utils/api/db/calls/influencers';
import { getSequenceInfluencersBySequenceIdCall as getSequenceInfluencersBySequenceId } from 'src/utils/api/db/calls/sequence-influencers';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { DatabaseWithCustomTypes } from 'types';
import type { ServerContext } from 'src/utils/api/iqdata';
import { type SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { getSequenceByIdCall } from './sequences';
import { db } from 'src/utils/supabase-client';
import { serverLogger } from 'src/utils/logger-server';

export const getSequenceInfluencers = async (ctx: ServerContext, sequenceId: string) => {
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(ctx);
    const influencers = await getSequenceInfluencersBySequenceId(supabase)(sequenceId);

    const results: SequenceInfluencerManagerPage[] = [];

    for (const influencer of influencers) {
        try {
            const sequence = await db(getSequenceByIdCall)(supabase)(influencer.sequence_id);
            const influencerInfo = await getInfluencerSocialProfileById(supabase)(
                influencer.influencer_social_profile_id,
            );
            results.push({
                ...influencer,
                manager_first_name: sequence.manager_first_name,
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
