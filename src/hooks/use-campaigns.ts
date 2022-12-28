import { useCallback, useEffect, useState } from 'react';
import { fetcher } from 'src/utils/fetcher';
import useSWR from 'swr';
import { CampaignCreatorDB, CampaignDB } from 'types';
import { useUser } from './use-user';

export const useCampaigns = ({ campaignId }: any = {}) => {
    const { profile, user } = useUser();
    const { data } = useSWR(
        profile?.company_id ? `/api/campaigns?id=${profile.company_id}` : null,
        fetcher
    );
    const [loading, setLoading] = useState(false);
    const [campaign, setCampaign] = useState<CampaignDB | null>(null);
    const [campaignCreators, setCampaignCreators] = useState<CampaignCreatorDB[] | null>([]);

    useEffect(() => {
        if (data && campaignId) {
            const campaign = data?.find((c: any) => c.id === campaignId);
            setCampaign(campaign);
            setCampaignCreators(campaign.campaign_creators);
        }
    }, [campaignId, data]);

    const createCampaign = useCallback(
        async (input: any) => {
            await fetch('/api/campaigns/create', {
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

    const addCreatorToCampaign = useCallback(
        async (input: CampaignCreatorDBInsert) => {
            setLoading(true);
            console.log(input);
            await fetch('/api/campaigns/add-creator', {
                method: 'post',
                body: JSON.stringify({
                    ...input,
                    company_id: profile?.company_id
                })
            });
            setLoading(false);
        },
        [profile]
    );
    return {
        campaigns: data as CampaignDB[],
        createCampaign,
        updateCampaign,
        campaign,
        loading,
        campaignCreators,
        addCreatorToCampaign
    };
};
