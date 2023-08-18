import { getInfluencerSocialProfileByIdCall as getInfluencerSocialProfileById } from 'src/utils/api/db/calls/influencers';
import { getProfileByIdCall as getProfileById } from './profiles';
import { getSequenceInfluencersBySequenceIdCall as getSequenceInfluencersBySequenceId } from 'src/utils/api/db/calls/sequence-influencers';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { DatabaseWithCustomTypes } from 'types';
import type { ServerContext } from 'src/utils/api/iqdata';

export const getSequenceInfluencers = async (ctx: ServerContext, sequenceId: string) => {
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(ctx);
    const influencers = await getSequenceInfluencersBySequenceId(supabase)(sequenceId);
    return await Promise.all(
        influencers.map(async (influencer) => {
            const { data: managerInfo } = await getProfileById(supabase)(influencer.added_by);

            const influencerInfo = await getInfluencerSocialProfileById(supabase)(
                influencer.influencer_social_profile_id,
            );

            return {
                ...influencer,
                manager_first_name: managerInfo?.first_name,
                name: influencerInfo?.name,
                username: influencerInfo?.username,
                avatar_url: influencerInfo?.avatar_url,
                url: influencerInfo?.url,
                platform: influencerInfo?.platform,
                manager: {
                    id: managerInfo?.id ?? null,
                    avatar_url: managerInfo?.avatar_url,
                    company_id: managerInfo?.company_id ?? null,
                    first_name: managerInfo?.first_name ?? 'No',
                    last_name: managerInfo?.last_name ?? 'Name',
                },
            };
        }),
    );
};
