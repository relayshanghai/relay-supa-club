import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';
import { supabase } from 'src/utils/supabase-client';

export type CampaignNotesUpdatePutBody = {
    id: string;
    important: boolean;
};

export type CampaignNotesUpdatePutResult = null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }

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
