import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
    const { profileId, ...data } = JSON.parse(req.body);
    const { data: campaignNotes, error } = await supabase
        .from('campaign_notes')
        .delete()
        .eq('id', data.id)
        .eq('user_id', profileId);

    if (error) {
        serverLogger(error, 'error');
    }

    return res.status(httpCodes.OK).json(campaignNotes);
}
