import { useClientDb } from 'src/utils/client-db/use-client-db';
import useSWR from 'swr';
import type { CampaignDB } from 'src/utils/api/db';

export const useAllCampaignCreators = (campaigns: CampaignDB[]) => {
    const { getAllCampaignCreators } = useClientDb();

    const {
        data: allCampaignCreators,
        mutate: refreshCampaignCreators,
        isValidating,
        isLoading,
    } = useSWR(campaigns.length > 0 ? 'all-campaign-creators' : null, () =>
        getAllCampaignCreators(campaigns.map((campaign) => campaign.id)),
    );

    return {
        allCampaignCreators,
        refreshCampaignCreators,
        isValidating,
        isLoading,
    };
};
