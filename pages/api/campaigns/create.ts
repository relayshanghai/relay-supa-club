import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import type { CampaignDB, CampaignDBInsert } from 'src/utils/api/db';
import { checkSessionIdMatchesID } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger';
import { supabase } from 'src/utils/supabase-client';

export interface CampaignsCreatePostBody extends CampaignDBInsert {
    profile_id: string;
}
export type CampaignsCreatePostResponse = CampaignDB;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
    try {
        const { company_id, name, profile_id, ...data } = JSON.parse(
            req.body,
        ) as CampaignsCreatePostBody;

        if (!(await checkSessionIdMatchesID(profile_id, req, res))) {
            return res.status(httpCodes.UNAUTHORIZED).json({});
        }

        const { data: campaign, error } = await supabase
            .from('campaigns')
            .insert({
                company_id,
                name,
                ...data,
                status: 'not started',
                slug: name.toLowerCase().replace(/ /g, '-'),
            })
            .eq('company_id', company_id)
            .select()
            .single();

        if (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(error);
        }
        return res.status(httpCodes.OK).json(campaign);
    } catch (error) {}
}
