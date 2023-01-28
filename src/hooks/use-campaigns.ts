import { useCallback, useEffect, useState } from 'react';
import { fetcher, nextFetch } from 'src/utils/fetcher';
import useSWR from 'swr';

import type {
    CampaignUpdatePostBody,
    CampaignUpdatePostResponse,
} from 'pages/api/campaigns/update';

import { useUser } from './use-user';
import {
    CampaignCreatorDBInsert,
    CampaignCreatorDB,
    CampaignDBUpdate,
} from 'src/utils/api/db/types';
import { CampaignWithCompanyCreators } from 'src/utils/api/db';
import { CampaignsCreatePostBody, CampaignsCreatePostResponse } from 'pages/api/campaigns/create';
import {
    CampaignCreatorAddCreatorPostBody,
    CampaignCreatorAddCreatorPostResponse,
} from 'pages/api/campaigns/add-creator';

export const useCampaigns = ({ campaignId }: any = {}) => {
    const { profile } = useUser();
    const { data: campaigns, mutate: refreshCampaign } = useSWR<CampaignWithCompanyCreators[]>(
        profile?.company_id ? `/api/campaigns?id=${profile.company_id}` : null,
        fetcher,
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
        async (input: Omit<CampaignsCreatePostBody, 'company_id'>) => {
            if (!profile?.company_id) throw new Error('No profile found');

            const body: CampaignsCreatePostBody = {
                ...input,
                company_id: profile.company_id,
            };
            return await nextFetch<CampaignsCreatePostResponse>('campaigns/create', {
                method: 'post',
                body,
            });
        },

        [profile],
    );

    const updateCampaign = useCallback(
        async (input: CampaignDBUpdate) => {
            if (!profile?.company_id) throw new Error('No profile found');
            const body: CampaignUpdatePostBody = {
                ...input,
                company_id: profile.company_id,
            };
            return await nextFetch<CampaignUpdatePostResponse>('campaigns/update', {
                method: 'post',
                body,
            });
        },
        [profile],
    );

    const addCreatorToCampaign = useCallback(
        async (input: CampaignCreatorDBInsert) => {
            setLoading(true);
            if (!campaign?.id) throw new Error('No campaign found');
            const body: CampaignCreatorAddCreatorPostBody = {
                ...input,
                campaign_id: campaign.id,
            };
            await nextFetch<CampaignCreatorAddCreatorPostResponse>('campaigns/add-creator', {
                method: 'post',
                body,
            });

            setLoading(false);
        },
        [campaign?.id],
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
        async (input: CampaignCreatorDB) => {
            setLoading(true);
            if (!campaign?.id) throw new Error('No campaign found');
            await nextFetch('campaigns/delete-creator', {
                method: 'delete',
                body: {
                    ...input,
                    campaign_id: campaign.id,
                },
            });
            setLoading(false);
        },
        [campaign?.id],
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
        refreshCampaign,
    };
};
