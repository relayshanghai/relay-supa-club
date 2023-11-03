import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useClientDb, useDB } from 'src/utils/client-db/use-client-db';
import { useCompany } from './use-company';
import type { CampaignDB, CampaignDBInsert } from 'src/utils/api/db/types';
import { getSales } from 'src/utils/api/db/calls/sales';

/**
 * Hook to fetch campaigns and create/update campaigns
 * @param campaignId The campaign id to fetch
 */
export const useCampaigns = ({ campaignId }: { campaignId?: string }) => {
    const { company } = useCompany();
    const { getCampaigns, createCampaign: createCampaignCall, updateCampaign } = useClientDb();
    const [totalSales, setTotalSales] = useState<number>(0);
    const {
        data: allCampaigns,
        mutate: refreshCampaigns,
        isValidating,
        isLoading: loading,
    } = useSWR(company?.id ? ['campaigns', company?.id] : null, ([_path, companyId]) => getCampaigns(companyId));

    const getFromSales = useDB<typeof getSales>(getSales);
    const getCampaignSales = useCallback(async () => {
        if (!company?.id) {
            return;
        }
        setTotalSales(await getFromSales(company.id));
    }, [getFromSales, company?.id]);

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
            const activeCampaigns = allCampaigns.filter((campaign) => !campaign.archived);
            activeCampaigns.sort((a, b) => {
                if (a.updated_at && b.updated_at) {
                    return new Date(a.updated_at) < new Date(b.updated_at) ? 1 : -1;
                }
                return 0;
            });
            const archivedCampaigns = allCampaigns.filter((campaign) => campaign.archived);
            setCampaigns(activeCampaigns);
            setArchivedCampaigns(archivedCampaigns);
        }
    }, [allCampaigns]);

    const createCampaign = useCallback(
        (input: CampaignDBInsert) => createCampaignCall(input, company?.id),
        [createCampaignCall, company?.id],
    );

    return {
        /** All campaigns that are not archived and are active */
        campaigns,
        /** All campaigns that are archived */
        archivedCampaigns,
        createCampaign,
        updateCampaign,
        campaign,
        loading,
        isValidating,
        refreshCampaigns,
        getCampaignSales,
        totalSales,
    };
};
