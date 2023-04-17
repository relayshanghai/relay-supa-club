import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';
import { supabase } from 'src/utils/supabase-client';

export type CampaignDeleteBody = {
    id: string;
};

export type CampaignDeleteResponse = null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }

    const { id } = req.body as CampaignDeleteBody;

    if (!id) return res.status(httpCodes.BAD_REQUEST).json({});

    const { data: campaign, error } = await supabase.from('campaigns').delete().eq('id', id);

    if (error) {
        serverLogger(error, 'error');
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(error);
    }

    const result: CampaignDeleteResponse = campaign;

    return res.status(httpCodes.OK).json(result);
}
