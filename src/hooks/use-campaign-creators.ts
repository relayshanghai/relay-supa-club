import { useCallback, useState } from 'react';
import useSWR from 'swr';

import { useUser } from './use-user';
import type { CampaignCreatorDBUpdate, CampaignDB } from 'src/utils/api/db/types';

import { clientLogger } from 'src/utils/logger-client';
import { useClientDb } from 'src/utils/client-db/use-client-db';
import type { CampaignCreatorInsert } from 'src/utils/client-db/campaignCreators';
import { fetchReport } from 'src/utils/api/iqdata/fetch-report';
import type { CreatorPlatform, DatabaseWithCustomTypes } from 'types';
import { saveInfluencer } from 'src/utils/save-influencer';
import type { SupabaseClient } from '@supabase/supabase-js';

//The transform function is not used now, as the image proxy issue is handled directly where calls for the image.But this is left for future refactor. TODO:Ticket V2-181
// const transformCampaignCreators = (creators: CampaignCreatorDB[]) => {
//     return creators.map((creator: CampaignCreatorDB) => {
//         return {
//             ...creator,
//             avatar_url: imgProxy(creator.avatar_url) as string,
//         };
//     });
// };

const getInfluencerSocialProfile = async (
    db: SupabaseClient<DatabaseWithCustomTypes>,
    platform_id: string,
    platform: CreatorPlatform,
) => {
    // @todo: refactor db call to fit dependency injection
    const getInfluencerSocialByReference = async (platform_id: string) => {
        const { data, error } = await db
            .from('influencer_social_profiles')
            .select()
            .match({
                reference_id: `iqdata:${platform_id}`,
            })
            .maybeSingle();

        return !error ? data : null;
    };

    const socialProfile = await getInfluencerSocialByReference(platform_id);

    if (socialProfile) {
        return socialProfile;
    }

    const report = await fetchReport(platform_id, platform);

    if (!report) {
        throw new Error(`Cannot fetch report for influencer: ${platform_id}, ${platform}`);
    }

    const [_, newSocialProfile] = await saveInfluencer(report);

    if (newSocialProfile === null) {
        throw new Error(`Cannot save influencer: ${platform_id}, ${platform}`);
    }

    return newSocialProfile;
};

/**
 * Hook to fetch campaigns and create/update campaigns
 * @param campaignId The campaign id to fetch
 * @param companyId The company id to fetch campaigns for. Only use this when you want to enable admins to view/edit other companies' campaigns. currently only used in the admin dashboard pages
 * @returns
 */
export const useCampaignCreators = ({
    campaign,
    companyId: passedInCompanyId,
}: {
    campaign?: CampaignDB;
    companyId?: string;
}) => {
    const { profile } = useUser();
    const { supabaseClient, getCampaignCreators, insertCampaignCreator, updateCampaignCreator, deleteCampaignCreator } =
        useClientDb();

    const companyId = passedInCompanyId ?? profile?.company_id;
    const {
        data: campaignCreators,
        mutate: refreshCampaignCreators,
        isValidating,
        isLoading,
        // need to add the campaign id to the key so that the cache is invalidated when the campaign id changes
    } = useSWR(companyId && campaign?.id ? 'campaign-creators' + campaign.id : null, () =>
        getCampaignCreators(campaign?.id ?? ''),
    );

    const [loading, setLoading] = useState(false);

    const addCreatorToCampaign = useCallback(
        async (input: CampaignCreatorInsert) => {
            setLoading(true);

            try {
                if (!input.campaign_id) throw new Error('No campaign_id found');
                if (!profile?.id) {
                    throw new Error('No profile.id found');
                }

                let influencer = null;

                // @note: wrap in try..catch to observe which influencers will cause problems
                try {
                    influencer = await getInfluencerSocialProfile(supabaseClient, input.creator_id, input.platform);
                } catch (error) {
                    clientLogger(error, 'error', true);
                }

                const body: CampaignCreatorInsert = {
                    ...input,
                    influencer_social_profiles_id: influencer ? influencer.id : null,
                    added_by_id: profile?.id,
                    id: undefined, // force undefined so that the backend can generate a new id
                    campaign_id: input.campaign_id,
                };
                insertCampaignCreator(body);
            } catch (error) {
                clientLogger(error, 'error');
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [insertCampaignCreator, profile?.id, supabaseClient],
    );

    const updateCreatorInCampaign = useCallback(
        async (input: CampaignCreatorDBUpdate) => {
            setLoading(true);
            try {
                if (!campaign?.id) throw new Error('No campaign found');
                await updateCampaignCreator({
                    ...input,
                    campaign_id: campaign.id,
                });
            } catch (error) {
                clientLogger(error, 'error');
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [campaign?.id, updateCampaignCreator],
    );

    const deleteCreatorInCampaign = useCallback(
        async ({ creatorId, campaignId }: { creatorId: string; campaignId: string }) => {
            setLoading(true);
            if (!campaignId) throw new Error('No campaign found');
            try {
                await deleteCampaignCreator({
                    creatorId,
                    campaignId,
                });
            } catch (error) {
                clientLogger(error, 'error');
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [deleteCampaignCreator],
    );

    return {
        loading,
        isValidating,
        isLoading,
        campaignCreators,
        addCreatorToCampaign,
        deleteCreatorInCampaign,
        updateCreatorInCampaign,
        refreshCampaignCreators,
    };
};
