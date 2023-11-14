import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { CompanyDB, ProfileDB } from 'src/utils/api/db';
import { supabase } from 'src/utils/supabase-client';

export interface ClientInfo extends CompanyDB {
    profiles: ProfileDB[];
    hasOutreach: boolean;
}

export type AdminClientsGetResponse = ClientInfo[];

const hasSequenceSendEmail = (profile: ProfileDB) =>
    profile.sequence_send_email && profile.sequence_send_email.length > 0;

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const { data: companies, error: companyError } = await supabase.from('companies').select();
    const { data: profiles, error: profileError } = await supabase.from('profiles').select();
    if (!companies || !profiles || companyError || profileError) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }

    const result: AdminClientsGetResponse = companies.map((company) => {
        const companyProfiles = profiles.filter((profile) => profile.company_id === company.id);
        return {
            ...company,
            profiles: companyProfiles,
            hasOutreach: companyProfiles.some(hasSequenceSendEmail),
        };
    });

    // put the active subscriptions at the top, trials second and the rest at the bottom
    result.sort((a, b) => {
        // has outreach on top
        if (a.hasOutreach && b.hasOutreach) return 0;
        if (a.hasOutreach) return -1;
        if (b.hasOutreach) return 1;

        if (a.subscription_status === 'active' && b.subscription_status === 'active') return 0;
        if (a.subscription_status === 'active') return -1;
        if (b.subscription_status === 'active') return 1;
        if (a.subscription_status === 'trial' && b.subscription_status === 'trial') return 0;
        if (a.subscription_status === 'trial') return -1;
        if (b.subscription_status === 'trial') return 1;
        return 0;
    });
    return res.status(httpCodes.OK).json(result);
}

export default ApiHandler({
    getHandler,
});
