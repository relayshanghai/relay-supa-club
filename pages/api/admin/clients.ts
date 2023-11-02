import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { CampaignDB, CompanyDB, ProfileDB } from 'src/utils/api/db';
import { supabase } from 'src/utils/supabase-client';

export interface ClientInfo extends CompanyDB {
    campaigns: CampaignDB[];
    profiles: ProfileDB[];
}

export type AdminClientsGetResponse = ClientInfo[];

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const { data: companies, error: companyError } = await supabase.from('companies').select();
    const { data: campaigns, error: campaignError } = await supabase.from('campaigns').select();
    const { data: profiles, error: profileError } = await supabase.from('profiles').select();
    if (!campaigns || !companies || !profiles || companyError || profileError || campaignError) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }

    const result: AdminClientsGetResponse = companies.map((company) => {
        const companyCampaigns = campaigns.filter((campaign) => campaign.company_id === company.id);
        const companyProfiles = profiles.filter((profile) => profile.company_id === company.id);
        return {
            ...company,
            campaigns: companyCampaigns,
            profiles: companyProfiles,
        };
    });
    return res.status(httpCodes.OK).json(result);
}

export default ApiHandler({
    getHandler,
});
