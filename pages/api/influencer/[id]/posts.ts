import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { getCampaignCreator, updateCampaignCreator } from 'src/utils/api/db/calls/campaign-creators';
import { getInfluencerPostsBySocialProfile } from 'src/utils/api/db/calls/influencer-post';
import { db } from 'src/utils/supabase-client';
import type { PostInfo } from '../posts';
import { fetchReport } from 'src/utils/api/iqdata/fetch-report';
import { saveInfluencer } from 'src/utils/save-influencer';
import type { CampaignCreatorDB, CampaignCreatorDBInsert } from 'src/utils/api/db';
import type { ServerContext } from 'src/utils/api/iqdata';

export type InfluencerPostResponse = PostInfo[] | { error: string };

// @note: link campaign_creators to influencer_social_profiles
//        https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/416
const patchCampaignCreatorWithoutInfluencerSocial = async (
    creator: CampaignCreatorDBInsert,
    context?: ServerContext,
): Promise<CampaignCreatorDB> => {
    const _updateCampaignCreator = db<typeof updateCampaignCreator>(updateCampaignCreator);

    if (!creator.id) {
        throw new Error(`Cannot patch influencer: ${creator.creator_id}, ${creator.platform}`);
    }

    const metadata = {
        systemCall: true,
        action: `api:influencer/${creator.id}/posts`,
        functionName: 'fetchReport',
    };

    const report = await fetchReport(creator.creator_id, creator.platform, context && { ...context, metadata });

    if (!report) {
        throw new Error(`Cannot fetch report for influencer: ${creator.creator_id}, ${creator.platform}`);
    }

    const [_, socialProfile] = await db<typeof saveInfluencer>(saveInfluencer)(report);

    if (socialProfile === null) {
        throw new Error(`Cannot save influencer: ${creator.creator_id}, ${creator.platform}`);
    }

    const updatedCreator = await _updateCampaignCreator(creator.id, {
        influencer_social_profiles_id: socialProfile.id,
    });

    return updatedCreator;
};

const getHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const campaignCreatorId = req.query.id as string;

    if (!campaignCreatorId) {
        return res.status(httpCodes.BAD_REQUEST).json({
            error: 'Invalid request',
        });
    }

    const _getCampaignCreator = db<typeof getCampaignCreator>(getCampaignCreator);
    const _getInfluencerPostsBySocialProfile = db<typeof getInfluencerPostsBySocialProfile>(
        getInfluencerPostsBySocialProfile,
    );

    let creator = await _getCampaignCreator(campaignCreatorId);

    if (!creator) {
        return res.status(httpCodes.NOT_FOUND).json({
            error: 'Not found',
        });
    }

    if (!creator.influencer_social_profiles_id) {
        const metadata = {
            creator,
            action: 'influencer-posts',
        };
        creator = await patchCampaignCreatorWithoutInfluencerSocial(creator, { req, res, metadata });
    }

    const posts = await _getInfluencerPostsBySocialProfile(creator.influencer_social_profiles_id);

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

export default ApiHandler({
    getHandler,
});
