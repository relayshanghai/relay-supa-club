import { useClientDb } from 'src/utils/client-db/use-client-db';
import useSWR from 'swr';
import type { CampaignDB } from 'src/utils/api/db';

export const useAllCampaignCreators = (campaigns: CampaignDB[]) => {
    const { getAllCampaignCreatorsByCampaignIds } = useClientDb();

    const campaignIds = campaigns.map((campaign) => campaign.id);
    const {
        data: allCampaignCreators,
        mutate: refreshCampaignCreators,
        isValidating,
        isLoading,
    } = useSWR(campaigns.length > 0 ? [campaignIds, 'all-campaign-creators'] : null, ([ids]) =>
        getAllCampaignCreatorsByCampaignIds(ids),
    );

    return {
        allCampaignCreators,
        refreshCampaignCreators,
        isValidating,
        isLoading,
    };
};
