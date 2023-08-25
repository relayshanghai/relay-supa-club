import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { type SequenceInfluencer } from 'src/utils/api/db';
import { getSequenceInfluencers } from 'src/utils/api/db/calls/get-sequence-influencers';

export type SequenceInfluencerManagerPage = SequenceInfluencer & {
    iqdata_id?: string;
    influencer_id?: string;
    name?: string | null;
    username?: string;
    avatar_url?: string | null;
    url?: string;
    platform?: string;
    manager_first_name: string;
};

const postHandler: NextApiHandler = async (req, res) => {
    const sequenceIds: string[] = req.body;
    const influencersPromises = sequenceIds.map((sequenceId) => getSequenceInfluencers({ req, res }, sequenceId));
    const influencersArrays = await Promise.all(influencersPromises);
    const combinedInfluencers = influencersArrays.reduce((accumulator, influencers) => {
        return [...accumulator, ...influencers];
    }, []);
    return res.status(httpCodes.OK).json(combinedInfluencers);
};

export default ApiHandler({ postHandler });
