import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }

    const { ...data } = JSON.parse(req.body);
    const { data: campaignNotes, error } = await supabase
        .from('campaign_notes')
        .update({ important: data.important })
        .eq('id', data.id);
    if (error) {
        serverLogger(error, 'error');
    }
    return res.status(httpCodes.OK).json(campaignNotes);
}
