import { getInfluencerSocialProfileByIdCall as getInfluencerSocialProfileById } from 'src/utils/api/db/calls/influencers';
import { getProfileByIdCall as getProfileById } from './profiles';
import { getSequenceInfluencersBySequenceIdCall as getSequenceInfluencersBySequenceId } from 'src/utils/api/db/calls/sequence-influencers';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { DatabaseWithCustomTypes } from 'types';
import type { ServerContext } from 'src/utils/api/iqdata';
import { type SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';

export const getSequenceInfluencers = async (ctx: ServerContext, sequenceId: string) => {
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(ctx);
    const influencers = await getSequenceInfluencersBySequenceId(supabase)(sequenceId);
    return await Promise.all(
        influencers.map(async (influencer: SequenceInfluencerManagerPage) => {
            const managerInfo = await getProfileById(supabase)(influencer.added_by);
            const influencerInfo = await getInfluencerSocialProfileById(supabase)(
                influencer.influencer_social_profile_id,
            );
            return {
                ...influencer,
                name: influencerInfo?.name,
                username: influencerInfo?.username,
                avatar_url: influencerInfo?.avatar_url,
                url: influencerInfo?.url,
                platform: influencerInfo?.platform,
                manager_first_name: managerInfo?.data?.first_name,
                manager_last_name: managerInfo?.data?.last_name,
            };
        }),
    );
};
