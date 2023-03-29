import { useCallback, useEffect, useState } from 'react';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import useSWR from 'swr';

import type {
    CampaignUpdatePostBody,
    CampaignUpdatePostResponse,
} from 'pages/api/campaigns/update';

import { useUser } from './use-user';
import type { CampaignCreatorDB, CampaignDBUpdate } from 'src/utils/api/db/types';
import type { CampaignWithCompanyCreators } from 'src/utils/api/db';
import type {
    CampaignsCreatePostBody,
    CampaignsCreatePostResponse,
} from 'pages/api/campaigns/create';
import type {
    CampaignCreatorAddCreatorPostBody,
    CampaignCreatorAddCreatorPostResponse,
} from 'pages/api/campaigns/add-creator';
import type { CampaignsIndexGetQuery, CampaignsIndexGetResult } from 'pages/api/campaigns';
import type {
    CampaignCreatorsDeleteBody,
    CampaignCreatorsDeleteResponse,
} from 'pages/api/campaigns/delete-creator';
import { clientLogger } from 'src/utils/logger-client';

//The transform function is not used now, as the image proxy issue is handled directly where calls for the image.But this is left for future refactor. TODO:Ticket V2-181
// const transformCampaignCreators = (creators: CampaignCreatorDB[]) => {
//     return creators.map((creator: CampaignCreatorDB) => {
//         return {
//             ...creator,
//             avatar_url: imgProxy(creator.avatar_url) as string,
//         };
//     });
// };

/**
 * Hook to fetch campaigns and create/update campaigns
 * @param campaignId The campaign id to fetch
 * @param companyId The company id to fetch campaigns for. Only use this when you want to enable admins to view/edit other companies' campaigns. currently only used in the admin dashboard pages
 * @returns
 */
export const useCampaigns = ({
    campaignId,
    companyId: passedInCompanyId,
}: {
    campaignId?: string;
    companyId?: string;
}) => {
    const { profile } = useUser();
    const companyId = passedInCompanyId ?? profile?.company_id;
    const {
        data: campaigns,
        mutate: refreshCampaign,
        isValidating,
        isLoading,
    } = useSWR(companyId ? 'campaigns' : null, (path) =>
        nextFetchWithQueries<CampaignsIndexGetQuery, CampaignsIndexGetResult>(path, {
            id: companyId ?? '',
        }),
    );
    const [loading, setLoading] = useState(false);
    const [campaign, setCampaign] = useState<CampaignWithCompanyCreators | null>(null);
    const [campaignCreators, setCampaignCreators] = useState<
        CampaignWithCompanyCreators['campaign_creators'] | null
    >([]);

    useEffect(() => {
        if (campaigns && campaigns?.length > 0 && campaignId) {
            const campaign = campaigns?.find((c) => c.id === campaignId);
            if (campaign) {
                setCampaign(campaign);
            }
            if (campaign?.campaign_creators) {
                setCampaignCreators(campaign.campaign_creators);
            }
        }
    }, [campaignId, campaigns]);

    const createCampaign = useCallback(
        async (input: Omit<CampaignsCreatePostBody, 'company_id'>) => {
            if (!companyId) throw new Error('No profile found');

            const body: CampaignsCreatePostBody = {
                ...input,
                company_id: companyId,
            };
            return await nextFetch<CampaignsCreatePostResponse>('campaigns/create', {
                method: 'post',
                body,
            });
        },

        [companyId],
    );

    const updateCampaign = useCallback(
        async (input: CampaignDBUpdate) => {
            if (!companyId) throw new Error('No profile found');
            const body: CampaignUpdatePostBody = {
                ...input,
                company_id: companyId,
            };
            return await nextFetch<CampaignUpdatePostResponse>('campaigns/update', {
                method: 'post',
                body,
            });
        },
        [companyId],
    );

    const addCreatorToCampaign = useCallback(
        async (input: CampaignCreatorAddCreatorPostBody) => {
            setLoading(true);
            if (!campaign?.id) throw new Error('No campaign found');
            const body: CampaignCreatorAddCreatorPostBody = {
                ...input,
                added_by_id: profile?.id ?? '',
                campaign_id: campaign.id,
            };
            await nextFetch<CampaignCreatorAddCreatorPostResponse>('campaigns/add-creator', {
                method: 'post',
                body,
            });

            setLoading(false);
        },
        [campaign?.id, profile?.id],
    );

    const updateCreatorInCampaign = useCallback(
        async (input: CampaignCreatorDB) => {
            setLoading(true);
            if (!campaign?.id) throw new Error('No campaign found');
            await nextFetch('campaigns/update-creator', {
                method: 'put',
                body: {
                    ...input,
                    campaign_id: campaign.id,
                },
            });
            setLoading(false);
        },
        [campaign?.id],
    );

    const deleteCreatorInCampaign = useCallback(
        async ({ id }: CampaignCreatorDB) => {
            setLoading(true);
            if (!campaign?.id) throw new Error('No campaign found');
            const body: CampaignCreatorsDeleteBody = {
                id,
                campaignId: campaign.id,
            };
            try {
                await nextFetch<CampaignCreatorsDeleteResponse>('campaigns/delete-creator', {
                    method: 'delete',
                    body,
                });
            } catch (error) {
                clientLogger(error, 'error');
            } finally {
                setLoading(false);
            }
        },
        [campaign?.id],
    );

    return {
        campaigns,
        createCampaign,
        updateCampaign,
        campaign,
        loading,
        isValidating,
        isLoading,
        campaignCreators,
        addCreatorToCampaign,
        deleteCreatorInCampaign,
        updateCreatorInCampaign,
        refreshCampaign,
    };
};
