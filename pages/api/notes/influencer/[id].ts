import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { RelayDatabase } from 'src/utils/api/db';
import { db } from 'src/utils/supabase-client';

export async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const sequenceInfluencerId = req.query.id;
    const user_id = req.query.author;

    if (!sequenceInfluencerId) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Not found' });
    }

    const getNotesBySequenceInfluencer =
        (db: RelayDatabase) => async (sequence_influencer_id: string, filter: { user_id?: string }) => {
            let query = db
                .from('campaign_notes')
                .select('*, profiles(id, first_name, last_name)')
                .eq('sequence_influencer_id', sequence_influencer_id);

            if (filter.user_id) {
                query = query.eq('user_id', filter.user_id);
            }

            const { data, error } = await query;
            if (error) throw error;

            return data;
        };

    const notes = await db(getNotesBySequenceInfluencer)(sequenceInfluencerId, { user_id });

    return res.status(httpCodes.OK).json(notes);
}

export default ApiHandler({
    getHandler,
});
