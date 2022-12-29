import { useCallback, useEffect, useState } from 'react';
import { fetcher, nextFetch } from 'src/utils/fetcher';
import useSWR from 'swr';
import { CampaignDB, CampaignWithCompany } from 'types';
import { useUser } from './use-user';

export const useCampaigns = ({ campaignId }: any = {}) => {
    const { profile } = useUser();

    const { data } = useSWR<CampaignWithCompany[]>(
        profile?.company_id ? `/api/campaigns?id=${profile.company_id}` : null,
        fetcher
    );

    const [campaign, setCampaign] = useState<CampaignWithCompany | null>(null);

    useEffect(() => {
        if (data && campaignId) {
            const campaign = data?.find((c: any) => c.id === campaignId);
            if (campaign) setCampaign(campaign);
        }
    }, [campaignId, data]);

    const createCampaign = useCallback(
        async (input: any) =>
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
        async ({ _companies, ...input }: any) => {
            await fetch(`/api/campaigns/update`, {
                method: 'post',
                body: JSON.stringify({
                    ...input,
                    company_id: profile?.company_id
                })
            });
        },
        [profile]
    );

    return {
        campaigns: data as CampaignDB[],
        createCampaign,
        updateCampaign,
        campaign
    };
};
