import { useCallback, useEffect, useState } from 'react';
import { fetcher, nextFetch } from 'src/utils/fetcher';
import useSWR from 'swr';

import type { CampaignUpdatePostBody } from 'pages/api/campaigns/update';

import { useUser } from './use-user';
import {
    CampaignCreatorDBInsert,
    CampaignCreatorDB,
    CampaignDBInsert,
    CampaignDBUpdate
} from 'src/utils/api/db/types';
import { CampaignWithCompanyCreators } from 'src/utils/api/db';

export const useCampaigns = ({ campaignId }: any = {}) => {
    const { profile } = useUser();
    const { data: campaigns, mutate: refreshCampaign } = useSWR<CampaignWithCompanyCreators[]>(
        profile?.company_id ? `/api/campaigns?id=${profile.company_id}` : null,
        fetcher
    );
    const [loading, setLoading] = useState(false);
    const [campaign, setCampaign] = useState<CampaignWithCompanyCreators | null>(null);
    const [campaignCreators, setCampaignCreators] = useState<
        CampaignWithCompanyCreators['campaign_creators'] | null
    >([]);

    useEffect(() => {
        if (campaigns && campaigns?.length > 0 && campaignId) {
            const campaign = campaigns?.find((c) => c.id === campaignId);
            if (campaign) setCampaign(campaign);
            if (campaign?.campaign_creators) setCampaignCreators(campaign.campaign_creators);
        }
    }, [campaignId, campaigns]);

    const createCampaign = useCallback(
        async (input: CampaignDBInsert) =>
            await nextFetch('campaigns/create', {
                method: 'post',
                body: JSON.stringify({
                    ...input,
                    company_id: profile?.company_id
                })
            }),

        [profile]
    );

    const updateCampaign = useCallback(
        async (input: CampaignDBUpdate) => {
            const body: CampaignUpdatePostBody = {
                ...input,
                company_id: profile?.company_id || undefined
            };
            return await nextFetch<CampaignUpdatePostBody>('campaigns/update', {
                method: 'post',
                body: JSON.stringify(body)
            });
        },
        [profile]
    );

    const addCreatorToCampaign = useCallback(
        async (input: CampaignCreatorDBInsert) => {
            setLoading(true);
            await nextFetch('campaigns/add-creator', {
                method: 'post',
                body: JSON.stringify({
                    ...input,
                    company_id: profile?.company_id
                })
            });

            setLoading(false);
        },
        [profile?.company_id]
    );

    const updateCreatorInCampaign = useCallback(
        async (input: CampaignCreatorDB) => {
            setLoading(true);
            await nextFetch('campaigns/update-creator', {
                method: 'put',
                body: JSON.stringify({
                    ...input,
                    campaign_id: campaign?.id
                })
            });
            setLoading(false);
        },
        [campaign?.id]
    );

    const deleteCreatorInCampaign = useCallback(
        async (input: CampaignCreatorDB) => {
            setLoading(true);
            await nextFetch('campaigns/delete-creator', {
                method: 'delete',
                body: JSON.stringify({
                    ...input,
                    campaign_id: campaign?.id
                })
            });
            setLoading(false);
        },
        [campaign?.id]
    );

    return {
        campaigns,
        createCampaign,
        updateCampaign,
        campaign,
        loading,
        campaignCreators,
        addCreatorToCampaign,
        deleteCreatorInCampaign,
        updateCreatorInCampaign,
        refreshCampaign
    };
};
