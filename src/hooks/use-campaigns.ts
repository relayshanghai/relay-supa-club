import { useCallback, useEffect, useState } from 'react';
import { fetcher } from 'src/utils/fetcher';
import useSWR from 'swr';
import { useUser } from './use-user';

export const useCampaigns = ({ campaignId }: any = {}) => {
    const { profile, user } = useUser();
    const { data } = useSWR(
        profile?.company_id ? `/api/campaigns?id=${profile.company_id}` : null,
        fetcher
    );

    const [campaign, setCampaign] = useState(null);

    useEffect(() => {
        if (data && campaignId) {
            const campaign = data?.find((c: any) => c.id === campaignId);
            setCampaign(campaign);
        }
    }, [campaignId, data]);

    const createCampaign = useCallback(
        async (input: any) => {
            await fetch(`/api/campaigns/create`, {
                method: 'post',
                body: JSON.stringify({
                    ...input,
                    company_id: profile?.company_id
                })
            });
        },
        [profile]
    );

    const updateCampaign = useCallback(
        async ({ companies, ...input }: any) => {
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
        campaigns: data,
        createCampaign,
        updateCampaign,
        campaign
    };
};
