import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import type { CampaignCreatorDB } from 'src/utils/api/db';
import { checkSessionIdMatchesID } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger';
import { supabase } from 'src/utils/supabase-client';

export interface CampaignsDeleteCreatorPostBody extends CampaignCreatorDB {
    profile_id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
    try {
        const { campaign_id, profile_id, ...data } = JSON.parse(req.body);

        if (!(await checkSessionIdMatchesID(profile_id, req, res))) {
            return res.status(httpCodes.UNAUTHORIZED).json({});
        }

        const { error } = await supabase
            .from('campaign_creators')
            .delete()
            .eq('id', data.id)
            .eq('campaign_id', campaign_id);

        if (error) {
            serverLogger(error, 'error');
        }
        return res.status(httpCodes.OK).json({});
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}
