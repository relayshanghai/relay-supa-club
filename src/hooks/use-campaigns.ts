import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

import { useUser } from './use-user';
import type { CampaignDB, CampaignDBInsert } from 'src/utils/api/db/types';

import { useClientDb } from 'src/utils/client-db/use-client-db';

/**
 * Hook to fetch campaigns and create/update campaigns
 * @param campaignId The campaign id to fetch
 * @param companyId The company id to fetch campaigns for. Only use this when you want to enable admins to view/edit other companies' campaigns. currently only used in the admin dashboard pages
 * @returns
 */
export const useCampaigns = ({
    campaignId,
    companyId: passedInCompanyId,
}: {
    campaignId?: string;
    companyId?: string;
}) => {
    const { profile } = useUser();
    const { getCampaigns, createCampaign: createCampaignCall, updateCampaign } = useClientDb();

    const companyId = passedInCompanyId ?? profile?.company_id;
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
