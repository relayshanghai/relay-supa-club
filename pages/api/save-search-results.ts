import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { saveSearchResultsDbCall } from 'src/utils/api/boostbot/save-search-results';
import type { SearchTableInfluencer } from 'types';

export type SaveSearchResultsBody = {
    influencers: SearchTableInfluencer[];
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const influencers: SearchTableInfluencer[] = req.body;

    if (
        influencers.some(({ user_id, picture, topics, url, username, handle, custom_name, fullname }) => {
            const userHandle = user_id || username || handle || custom_name || fullname;
            if (!userHandle) return true;
            return user_id === undefined || picture === undefined || topics === undefined || url === undefined;
        })
    ) {
        return res.status(httpCodes.BAD_REQUEST).json({ message: 'not ok' });
    }
    // todo: fix in https://linear.app/boostbot/issue/BB-285/only-fetch-and-save-relevant-tags-iq-radar-chart-data-openai-when-a
    // const modifiedInfluencers = await Promise.allSettled(
    //     influencers.map(async (influencer) => {
    //         const platform = influencer.url ? extractPlatformFromURL(influencer.url) || 'youtube' : 'youtube';
    //         const userHandle =
    //             platform === 'youtube'
    //                 ? influencer.user_id
    //                 : influencer.username || influencer.handle || influencer.custom_name || influencer.fullname;
    //         const topicTags = await getRelevantTopicTagsByInfluencer(
    //             {
    //                 query: { q: userHandle ?? influencer.user_id, limit: 60, platform },
    //             },
    //             { req, res },
    //         );
    //         const generatedTagRelevance =
    //             topicTags.data.length === 0 ? [] : await getTopicsAndRelevance(topicTags.data);
    //         return {
    //             ...influencer,
    //             influencer_niche_graph: generatedTagRelevance,
    //         };
    //     }),
    // );

    // const fulfilledInfluencers = modifiedInfluencers
    //     .filter((result) => result.status === 'fulfilled')
    //     .map((result) => (result as PromiseFulfilledResult<SavedSearchTableInfluencer>).value);

    await saveSearchResultsDbCall(influencers);

    return res.status(httpCodes.OK).json({ message: 'ok' });
};

export default ApiHandler({ postHandler });
