import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { serverLogger } from 'src/utils/logger-server';
import { supabase } from 'src/utils/supabase-client';

export type CampaignNotesUpdatePutBody = {
    id: string;
    important: boolean;
};

export type CampaignNotesUpdatePutResult = null;

async function putHandler(req: NextApiRequest, res: NextApiResponse) {
    const { id, important } = req.body as CampaignNotesUpdatePutBody;

    if (!id) return res.status(httpCodes.BAD_REQUEST).json({});

    const { data: campaignNotes, error } = await supabase
        .from('campaign_notes')
        .update({ important: important })
        .eq('id', id);
    if (error) {
        serverLogger(error);
    }
    const result: CampaignNotesUpdatePutResult = campaignNotes;
    return res.status(httpCodes.OK).json(result);
}

export default ApiHandler({
    putHandler,
});
