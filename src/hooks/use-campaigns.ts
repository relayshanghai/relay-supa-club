import { useCallback, useEffect, useState } from 'react';
import { fetcher } from 'src/utils/fetcher';
import useSWR from 'swr';
import { CampaignCreate, CampaignDB, CampaignUpdate } from 'types';
import { useUser } from './use-user';

export interface CampaignDataCreateResponse extends CampaignCreate {
    id: string;
}

export const useCampaigns = ({ campaignId }: any = {}) => {
    const { profile } = useUser();
    const { data } = useSWR(
        profile?.company_id ? `/api/campaigns?id=${profile.company_id}` : null,
        fetcher
    );

    const [campaign, setCampaign] = useState<CampaignDB | null>(null);

    useEffect(() => {
        if (data && campaignId) {
            const campaign = data?.find((c: any) => c.id === campaignId);
            setCampaign(campaign);
        }
    }, [campaignId, data]);

    const createCampaign = useCallback(
        async (input: CampaignCreate) => {
            return (
                await fetch('/api/campaigns/create', {
                    method: 'post',
                    body: JSON.stringify({
                        ...input,
                        company_id: profile?.company_id
                    })
                })
            ).json() as Promise<CampaignDataCreateResponse>;
        },
        [profile]
    );

    const updateCampaign = useCallback(
        async (input: CampaignUpdate) => {
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
