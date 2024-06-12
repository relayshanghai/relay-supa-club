import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { default as httpCodes } from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { Addresses, SequenceInfluencer } from 'src/utils/api/db';
import { getSequenceInfluencers } from 'src/utils/api/db/calls/get-sequence-influencers';
import { db } from 'src/utils/supabase-client';
import type { SearchTableInfluencer } from 'types';

export type SequenceInfluencerManagerPage = SequenceInfluencer & {
    manager_first_name?: string;
    address?: Addresses['Update'] | null;
    recent_post_title: string;
    recent_post_url: string;
};

export type SequenceInfluencerManagerPageWithChannelData = SequenceInfluencerManagerPage & {
    channel_data: SearchTableInfluencer;
};

const postHandler: NextApiHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<SequenceInfluencerManagerPage[]>,
) => {
    const sequenceIds: string[] = req.body;
    const influencers = await db(getSequenceInfluencers)(sequenceIds);

    return res.status(httpCodes.OK).json(influencers);
};

export const config = {
    api: {
        responseLimit: '32mb',
    },
};

export default ApiHandler({ postHandler });
