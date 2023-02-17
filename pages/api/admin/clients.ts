import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { CampaignDB, CompanyDB, ProfileDB } from 'src/utils/api/db';
import { isCompanyOwnerOrRelayEmployee } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger';
import { supabase } from 'src/utils/supabase-client';

interface ClientInfo extends CompanyDB {
    campaigns: CampaignDB[];
    profiles: ProfileDB[];
}

export type AdminClientsGetResponse = ClientInfo[];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
    try {
        if (!(await isCompanyOwnerOrRelayEmployee(req, res))) {
            return res.status(httpCodes.UNAUTHORIZED).json({});
        }

        const { data: companies, error: companyError } = await supabase.from('companies').select();
        const { data: campaigns, error: campaignError } = await supabase.from('campaigns').select();
        const { data: profiles, error: profileError } = await supabase.from('profiles').select();
        if (
            !campaigns ||
            !companies ||
            !profiles ||
            companyError ||
            profileError ||
            campaignError
        ) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }

        const result: AdminClientsGetResponse = companies.map((company) => {
            const companyCampaigns = campaigns.filter(
                (campaign) => campaign.company_id === company.id,
            );
            const companyProfiles = profiles.filter((profile) => profile.company_id === company.id);
            return {
                ...company,
                campaigns: companyCampaigns,
                profiles: companyProfiles,
            };
        });
        return res.status(httpCodes.OK).json(result);
    } catch (error) {
        serverLogger(error, 'error');
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
}
