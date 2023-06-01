import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useClientDb } from 'src/utils/client-db/use-client-db';
import { useCompany } from './use-company';
import type { CampaignDB, CampaignDBInsert } from 'src/utils/api/db/types';

/**
 * Hook to fetch campaigns and create/update campaigns
 * @param campaignId The campaign id to fetch
 */
export const useCampaigns = ({ campaignId }: { campaignId?: string }) => {
    const { company } = useCompany();
    const { getCampaigns, createCampaign: createCampaignCall, updateCampaign } = useClientDb();

    const companyId = company?.id;

    const {
        data: allCampaigns,
        mutate: refreshCampaigns,
        isValidating,
        isLoading: loading,
    } = useSWR(companyId ? 'campaigns' : null, () => getCampaigns(companyId));
    const [campaign, setCampaign] = useState<CampaignDB | null>(null);

    const [campaigns, setCampaigns] = useState<CampaignDB[]>([]);
    const [archivedCampaigns, setArchivedCampaigns] = useState<CampaignDB[]>([]);

    useEffect(() => {
        if (allCampaigns && allCampaigns?.length > 0 && campaignId) {
            const campaign = allCampaigns?.find((c) => c.id === campaignId);
            if (campaign) {
                setCampaign(campaign);
            }
        }
    }, [campaignId, allCampaigns]);

    useEffect(() => {
        if (allCampaigns && allCampaigns.length > 0) {
            const unarchivedCampaigns = allCampaigns.filter((campaign) => !campaign.archived);
            const archivedCampaigns = allCampaigns.filter((campaign) => campaign.archived);
            setCampaigns(unarchivedCampaigns);
            setArchivedCampaigns(archivedCampaigns);
        }
    }, [allCampaigns]);

    const createCampaign = useCallback(
        (input: CampaignDBInsert) => createCampaignCall(input, companyId),
        [createCampaignCall, companyId],
    );

    return {
        /** All campaigns that are not archived */
        campaigns,
        /** All campaigns that are archived */
        archivedCampaigns,
        createCampaign,
        updateCampaign,
        campaign,
        loading,
        isValidating,
        refreshCampaigns,
    };
};
