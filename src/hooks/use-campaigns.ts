import { useCallback, useEffect, useState } from 'react';
import { fetcher, nextFetch } from 'src/utils/fetcher';
import useSWR from 'swr';
import { CampaignCreatorDBInsert, CampaignWithCompanyCreators } from 'types';
import { useUser } from './use-user';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const useCampaigns = ({ campaignId }: any = {}) => {
    const { profile } = useUser();
    const { data } = useSWR<CampaignWithCompanyCreators[]>(
        profile?.company_id ? `/api/campaigns?id=${profile.company_id}` : null,
        fetcher
    );
    const [loading, setLoading] = useState(false);
    const [campaign, setCampaign] = useState<CampaignWithCompanyCreators | null>(null);
    const [campaignCreators, setCampaignCreators] = useState<
        CampaignWithCompanyCreators['campaign_creators'] | null
    >([]);
    const { t } = useTranslation();

    useEffect(() => {
        if (data && campaignId) {
            const campaign = data?.find((c) => c.id === campaignId);
            if (campaign) setCampaign(campaign);
            if (campaign?.campaign_creators) setCampaignCreators(campaign.campaign_creators);
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
        async ({ _companies, ...input }: any) =>
            await nextFetch('campaigns/update', {
                method: 'post',
                body: JSON.stringify({
                    ...input,
                    company_id: profile?.company_id
                })
            }),

        [profile]
    );

    const addCreatorToCampaign = useCallback(
        async (input: CampaignCreatorDBInsert) => {
            setLoading(true);
            await fetch('/api/campaigns/add-creator', {
                method: 'post',
                body: JSON.stringify({
                    ...input,
                    company_id: profile?.company_id
                })
            });
            toast.success(t('campaigns.modal.addedSuccessfully'));

            setLoading(false);
        },
        [profile?.company_id, t]
    );
    return {
        campaigns: data as CampaignWithCompanyCreators[],
        createCampaign,
        updateCampaign,
        campaign,
        loading,
        campaignCreators,
        addCreatorToCampaign
    };
};
