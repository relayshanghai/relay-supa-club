import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { deleteInfluencerPost as deleteInfluencerPostQuery } from 'src/utils/api/db/calls/influencer-post';
import { db } from 'src/utils/supabase-client';

const deleteHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const postId = req.query.id as string;

    if (!postId) {
        return res.status(httpCodes.BAD_REQUEST).json({
            error: 'Invalid request',
        });
    }

    const deleteInfluencerPost = db<typeof deleteInfluencerPostQuery>(deleteInfluencerPostQuery);
    const post = await deleteInfluencerPost(postId);

    if (!post) {
        return res.status(httpCodes.NOT_FOUND).json({
            error: 'Not found',
        });
    }

    return res.status(httpCodes.OK).json(post);
};

export default ApiHandler({
    deleteHandler,
});
