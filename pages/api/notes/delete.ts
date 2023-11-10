import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { serverLogger } from 'src/utils/logger-server';
import { supabase } from 'src/utils/supabase-client';

export type CampaignNotesDeleteBody = {
    /** the note id */
    id: string;
    profileId: string;
};
export type CampaignNotesDeleteResponse = null;
async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
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

export default ApiHandler({
    deleteHandler,
});
