import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';
import { supabase } from 'src/utils/supabase-client';

export type CampaignNotesDeleteBody = {
    /** the note id */
    id: string;
    profileId: string;
};
export type CampaignNotesDeleteResponse = null;
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
    const { profileId, id } = req.body as CampaignNotesDeleteBody;

    if (!id || !profileId) return res.status(httpCodes.BAD_REQUEST).json({});

    const { data: campaignNotes, error } = await supabase
        .from('campaign_notes')
        .delete()
        .eq('id', id)
        .eq('user_id', profileId);

    if (error) {
        serverLogger(error);
    }
    const result: CampaignNotesDeleteResponse = campaignNotes;

    return res.status(httpCodes.OK).json(result);
}
