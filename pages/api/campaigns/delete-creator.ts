import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const { campaign_id, ...data } = JSON.parse(req.body);
        const { data: campaignCreators, error } = await supabase
            .from('campaign_creators')
            .delete()
            .eq('id', data.id)
            .eq('campaign_id', campaign_id);

        if (error) {
            serverLogger(error, 'error');
        }
        return res.status(httpCodes.OK).json(campaignCreators);
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
