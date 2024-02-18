import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import httpCodes, { OK } from 'src/constants/httpCodes';
import { ApiHandlerWithContext } from 'src/utils/api-handler';
import type { TopicsAndRelevance } from 'src/utils/api/boostbot/get-topic-relevance';
import { getTopicsAndRelevance } from 'src/utils/api/boostbot/get-topic-relevance';
import { createInfluencerReferenceId } from 'src/utils/api/iqdata/extract-influencer';
import {
    getInfluencerSocialProfileTopicsRelevances,
    saveInfluencerSocialProfileTopicsRelevances,
} from 'src/backend/database/influencer-social-profiles';
import { serverLogger } from 'src/utils/logger-server';

const GetTopicsAndRelevanceBody = z.object({
    topics: z
        .object({
            tag: z.string(),
            distance: z.number(),
        })
        .array(),
    iqdata_id: z.string(),
});

export type GetTopicsAndRelevanceBody = z.input<typeof GetTopicsAndRelevanceBody>;
export type GetTopicsAndRelevanceResponse = TopicsAndRelevance[];

/** gets topic relevances from openai based on topic tags generated from iqdatas topic tags dict.
 * checks if the topics relevances exist for this influencer in our db.
    // if not then fetch from iqdata and save it in our db. */
const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const result = GetTopicsAndRelevanceBody.safeParse(req.body);

    if (!result.success) {
        return res.status(httpCodes.BAD_REQUEST).json(result.error.format());
    }

    const { topics, iqdata_id } = result.data;
    const referenceId = createInfluencerReferenceId(iqdata_id);

    const existingTopicsRelevances = await getInfluencerSocialProfileTopicsRelevances()(referenceId);

    if (existingTopicsRelevances && Array.isArray(existingTopicsRelevances)) {
        return res.status(httpCodes.OK).json(existingTopicsRelevances);
    }

    const topicsAndRelevance: GetTopicsAndRelevanceResponse = await getTopicsAndRelevance(topics);

    try {
        await saveInfluencerSocialProfileTopicsRelevances()(referenceId, topicsAndRelevance);
    } catch (error) {
        serverLogger(error);
    }

    return res.status(OK).json(topicsAndRelevance);
};

export default ApiHandlerWithContext({ postHandler });
