import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { default as httpCodes } from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { countSequenceInfluencers, getSequenceByIdCall } from 'src/utils/api/db/calls/sequences';
import { db } from 'src/utils/supabase-client';
import { DBQueryReturn } from 'src/utils/types';

export type GetSequenceResponse = DBQueryReturn<typeof getSequenceByIdCall> & { total_influencers: number }

const getHandler: NextApiHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<GetSequenceResponse>,
) => {
    const id = String(req.query.id)

    const totalInfluencers = await db(countSequenceInfluencers)(id);
    const sequence = await db(getSequenceByIdCall)(id);

    return res.status(httpCodes.OK).json({
        ...sequence,
        total_influencers: totalInfluencers
    });
};

export default ApiHandler({ getHandler });
