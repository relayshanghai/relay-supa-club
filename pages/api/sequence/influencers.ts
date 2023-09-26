import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { default as httpCodes } from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { Addresses, SequenceInfluencer } from 'src/utils/api/db';
import { getSequenceInfluencers } from 'src/utils/api/db/calls/get-sequence-influencers';
import { db } from 'src/utils/supabase-client';

export type SequenceInfluencerManagerPage = SequenceInfluencer & {
    manager_first_name: string;
    address?: Addresses['Update'] | null;
    manager: {
        id: string | null;
        company_id: string | null;
        avatar_url?: string | null;
        first_name: string;
        last_name: string;
    };
};

const postHandler: NextApiHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<SequenceInfluencerManagerPage[]>,
) => {
    const sequenceIds: string[] = req.body;
    const influencersPromises = sequenceIds.map(db(getSequenceInfluencers));
    const influencersArrays = await Promise.all(influencersPromises);

    const combinedInfluencers = influencersArrays.reduce((accumulator, influencers) => {
        return [...accumulator, ...influencers];
    }, [] as SequenceInfluencerManagerPage[]);

    return res.status(httpCodes.OK).json(combinedInfluencers);
};

export default ApiHandler({ postHandler });
