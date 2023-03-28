import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';
import { supabase } from 'src/utils/supabase-client';

export type CampaignCreatorsDeleteBody = {
    id: string;
    campaignId: string;
};

export type CampaignCreatorsDeleteResponse = null;
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
    const { id, campaignId } = req.body as CampaignCreatorsDeleteBody;

    if (!id || !campaignId) return res.status(httpCodes.BAD_REQUEST).json({});

    const { data: campaignCreators, error } = await supabase
        .from('campaign_creators')
        .delete()
        .eq('id', id)
        .eq('campaign_id', campaignId);

    if (error) {
        serverLogger(error, 'error');
    }
    const result: CampaignCreatorsDeleteResponse = campaignCreators;

    return res.status(httpCodes.OK).json(result);
}
