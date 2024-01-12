import type { NextApiHandler } from 'next';
import type { SequenceInfluencer, SequenceInfluencersUpdate } from 'src/backend/database/sequence-influencers';
import {
    sequenceInfluencersUpdateSchema,
    updateSequenceInfluencerCall,
} from 'src/backend/database/sequence-influencers';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';

export type SequenceInfluencersPutRequestBody = SequenceInfluencersUpdate;
export type SequenceInfluencersPutRequestResponse = SequenceInfluencer;

const putHandler: NextApiHandler = async (req, res) => {
    const validated = sequenceInfluencersUpdateSchema.safeParse(req.body);
    if (!validated.success) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: validated.error });
    }
    const update = validated.data;
    const result: SequenceInfluencer = await updateSequenceInfluencerCall()(update);
    return res.status(httpCodes.OK).json(result);
};

export default ApiHandler({ putHandler });
