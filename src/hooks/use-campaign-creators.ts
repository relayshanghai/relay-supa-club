import { useCallback, useEffect, useState } from 'react';
import { fetcher } from 'src/utils/fetcher';
import useSWR from 'swr';
import { CampaignCreatorDB, CampaignCreatorDBInsert } from 'types';
import { useUser } from './use-user';

export const useCampaignCreators = ({ campaignId }: any = {}) => {
    const { profile } = useUser();
    const { data } = useSWR(
        profile?.company_id ? `/api/campaigns?id=${profile.company_id}` : null,
        fetcher
    );
    console.log({ data });
    const [campaignCreators, setCampaignCreators] = useState<CampaignCreatorDB[]>([]);
    useEffect(() => {
        if (data && campaignId) {
            const campaignCreators = data?.find((c: any) => c.campaign_id === campaignId);
            setCampaignCreators(campaignCreators);
        }
    }, [campaignId, data]);

    const addCreatorToCampaign = useCallback(
        async (input: CampaignCreatorDBInsert) => {
            await fetch('/api/campaigns/add-creator', {
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
        campaignCreators,
        addCreatorToCampaign
    };
};
