import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { CampaignDB, CampaignDBInsert } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger';
import { supabase } from 'src/utils/supabase-client';

export type CampaignsCreatePostBody = CampaignDBInsert;
export type CampaignsCreatePostResponse = CampaignDB;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id, name, ...data } = req.body as CampaignsCreatePostBody;
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
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
