import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import type { CampaignNotesDB, CampaignNotesInsertDB } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger';
import { supabase } from 'src/utils/supabase-client';

export type CampaignNotePostBody = CampaignNotesInsertDB;
export type CampaignNotePostResponse = CampaignNotesDB;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const { data } = JSON.parse(req.body);
        const { data: campaignNotes, error } = await supabase
            .from('campaign_notes')
            .delete()
            .eq('id', data.id);
        // .eq('campaign_creator_notes', campaignCreatorId);

        if (error) {
            serverLogger(error, 'error');
        }

        return res.status(httpCodes.OK).json(campaignNotes);
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
