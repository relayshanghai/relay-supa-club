import { useCallback, useEffect, useState } from 'react';
import { imgProxy, nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import useSWR from 'swr';

import type {
    CampaignUpdatePostBody,
    CampaignUpdatePostResponse,
} from 'pages/api/campaigns/update';

import { useUser } from './use-user';
import { CampaignCreatorDB, CampaignDBUpdate } from 'src/utils/api/db/types';
import { CampaignWithCompanyCreators } from 'src/utils/api/db';
import { CampaignsCreatePostBody, CampaignsCreatePostResponse } from 'pages/api/campaigns/create';
import {
    CampaignCreatorAddCreatorPostBody,
    CampaignCreatorAddCreatorPostResponse,
} from 'pages/api/campaigns/add-creator';
import { CampaignsIndexGetQuery, CampaignsIndexGetResult } from 'pages/api/campaigns';
import { CampaignCreatorUpdatePutBody } from 'pages/api/campaigns/update-creator';

const transformCampaignCreators = (creators: CampaignCreatorDB[]) => {
    return creators.map((creator: CampaignCreatorDB) => {
        return {
            ...creator,
            avatar_url: imgProxy(creator.avatar_url) ?? creator.avatar_url,
        };
    });
};

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
            profile_id: profile?.id ?? '',
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
                const transformed = transformCampaignCreators(campaign.campaign_creators);
                setCampaignCreators(transformed);
            }
        }
    }, [campaignId, campaigns]);

    const createCampaign = useCallback(
        async (input: Omit<CampaignsCreatePostBody, 'company_id' | 'profile_id'>) => {
            if (!companyId) throw new Error('No company found');
            if (!profile?.id) throw new Error('No profile found');

            const body: CampaignsCreatePostBody = {
                ...input,
                profile_id: profile.id,
                company_id: companyId,
            };
            return await nextFetch<CampaignsCreatePostResponse>('campaigns/create', {
                method: 'post',
                body,
            });
        },

        [companyId, profile?.id],
    );

    const updateCampaign = useCallback(
        async (input: CampaignDBUpdate) => {
            if (!companyId) throw new Error('No profile found');
            if (!profile?.id) throw new Error('No profile found');
            const body: CampaignUpdatePostBody = {
                ...input,
                company_id: companyId,
                profile_id: profile.id,
            };
            return await nextFetch<CampaignUpdatePostResponse>('campaigns/update', {
                method: 'post',
                body,
            });
        },
        [companyId, profile?.id],
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
            if (!profile?.id) throw new Error('No profile found');
            const body: CampaignCreatorUpdatePutBody = {
                ...input,
                campaign_id: campaign.id,
                profile_id: profile.id,
            };
            if (!campaign?.id) throw new Error('No campaign found');
            await nextFetch('campaigns/update-creator', {
                method: 'put',
                body,
            });
            setLoading(false);
        },
        [campaign?.id, profile?.id],
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
        isValidating,
        isLoading,
        campaignCreators,
        addCreatorToCampaign,
        deleteCreatorInCampaign,
        updateCreatorInCampaign,
        refreshCampaign,
    };
};
