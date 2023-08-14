import { getInfluencerSocialProfileByIdCall as getInfluencerSocialProfileById } from 'src/utils/api/db/calls/influencers';
import { type SequenceInfluencerManagerPage } from 'src/hooks/use-sequence-influencers';
import { getProfileByIdCall } from './profiles';
import { getSequenceInfluencersBySequenceIdCall as getSequenceInfluencersBySequenceId } from 'src/utils/api/db/calls/sequence-influencers';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { DatabaseWithCustomTypes } from 'types';
import type { ServerContext } from 'src/utils/api/iqdata';

export const getSequenceInfluencers = async (ctx: ServerContext, sequenceId: string) => {
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(ctx);
    const influencers = await getSequenceInfluencersBySequenceId(supabase)(sequenceId);
    const influencersWithInfo = await Promise.all(
        influencers.map(async (influencer: SequenceInfluencerManagerPage) => {
            const managerInfo = await getProfileByIdCall(supabase)(influencer.added_by);
            const influencerInfo = await getInfluencerSocialProfileById(supabase)(
                influencer.influencer_social_profile_id,
            );
            return {
                ...influencer,
                manager_first_name: managerInfo?.data?.first_name,
                name: influencerInfo?.name,
                username: influencerInfo?.username,
                avatar_url: influencerInfo?.avatar_url,
                url: influencerInfo?.url,
            };
        }),
    );
    return influencersWithInfo;
};
