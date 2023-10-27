import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import type { ApiError } from 'src/errors/api-error';
import { ApiHandler, RelayError } from 'src/utils/api-handler';
import type { SequenceInfluencersTable } from 'src/utils/api/db';
import { getInfluencerPostsBySocialProfile } from 'src/utils/api/db/calls/influencer-post';
import { getSequenceInfluencerByIdCall } from 'src/utils/api/db/calls/sequence-influencers';
import type { ServerContext } from 'src/utils/api/iqdata';
import { serverLogger } from 'src/utils/logger-server';
import { saveInfluencerPost } from 'src/utils/save-influencer-post';
import { scrapeInfluencerPost } from 'src/utils/scrape-influencer-post';
import { db } from 'src/utils/supabase-client';

export type PostUrl = {
    value: string;
    id: string;
    error: string | null;
};

export type InfluencerPostRequestBody = {
    posts: PostUrl[];
};

export type PostInfo = {
    title: string;
    postedDate: string;
    id: string;
    url: string;
};

export type InfluencerPostPostResponse = { successful: PostInfo[]; failed: PostUrl[] } | ApiError;
export type InfluencerPostResponse = PostInfo[] | ApiError;

const getHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<InfluencerPostResponse>) => {
    const sequence_influencer_id = req.query.id as string;

    const sequenceInfluencer = await db(getSequenceInfluencerByIdCall)(sequence_influencer_id);

    if (!sequence_influencer_id) {
        throw new RelayError('Cannot find influencer', 404);
    }

    const posts = await db(getInfluencerPostsBySocialProfile)(sequenceInfluencer.influencer_social_profile_id);

    const transformedPosts = posts.map((post) => {
        const { title, posted_date, id, url } = post;
        return {
            title: title || '',
            postedDate: posted_date || '',
            id,
            url,
        };
    });

    return res.status(httpCodes.OK).json(transformedPosts);
};

const processURL = async (
    sequenceInfluencer: SequenceInfluencersTable['Row'],
    url: string,
    context?: ServerContext,
) => {
    const scrape = await scrapeInfluencerPost(url, context);

    if (scrape.influencer.id !== sequenceInfluencer.influencer_social_profile_id) {
        throw new Error('Post not owned by influencer');
    }

    const post = await db(saveInfluencerPost)({
        type: '',
        influencer_social_profile_id: sequenceInfluencer.influencer_social_profile_id,
        sequence_influencer_id: sequenceInfluencer.id,
        sequence_id: sequenceInfluencer.sequence_id,
        url: url,
        posted_date: scrape.postedAt,
        title: scrape.title !== '' ? scrape.title : 'No Title',
        preview_url: scrape.preview_url,
        description: scrape.description,
    });

    return post;
};

const postHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<InfluencerPostPostResponse>) => {
    const successful: PostInfo[] = [];
    const failed: PostUrl[] = [];

    const body = req.body as InfluencerPostRequestBody;
    const sequence_influencer_id = req.query.id as string;

    const sequenceInfluencer = await db(getSequenceInfluencerByIdCall)(sequence_influencer_id);

    if (!sequenceInfluencer) {
        throw new RelayError('Cannot find influencer', 404);
    }

    for (const url of body.posts) {
        try {
            const post = await processURL(sequenceInfluencer, url.value, { req, res });

            successful.push({
                title: post.title || '',
                postedDate: post.posted_date || '',
                id: post.id,
                url: post.url,
            });
        } catch (error: any) {
            serverLogger(error);
            url.error = 'Invalid post URL. The URL must be belong to the influencer';
            failed.push(url);
        }
    }

    res.status(httpCodes.OK).json({ successful, failed });
};

export default ApiHandler({
    getHandler,
    postHandler,
});
