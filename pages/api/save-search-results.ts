import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { type SavedSearchTableInfluencer, saveSearchResultsDbCall } from 'src/utils/api/boostbot/save-search-results';
import { getRelevantTopicTagsByInfluencer } from 'src/utils/api/iqdata/topics/get-relevant-topic-tags';
import { extractPlatformFromURL } from 'src/utils/extract-platform-from-url';
import type { SearchTableInfluencer } from 'types';
import { getTopicsAndRelevance } from 'src/utils/api/boostbot/get-topic-relevance';

export type SaveSearchResultsBody = {
    influencers: SearchTableInfluencer[];
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const influencers: SearchTableInfluencer[] = req.body;

    if (
        influencers.some(({ fullname, user_id, picture, topics, url }) => {
            return (
                user_id === undefined ||
                fullname === undefined ||
                picture === undefined ||
                topics === undefined ||
                url === undefined
            );
        })
    ) {
        return res.status(httpCodes.BAD_REQUEST).json({ message: 'not ok' });
    }
    const modifiedInfluencers = await Promise.allSettled(
        influencers.map(async (influencer) => {
            const platform = influencer.url ? extractPlatformFromURL(influencer.url) || 'youtube' : 'youtube';
            const userHandle =
                platform === 'youtube'
                    ? influencer.user_id
                    : influencer.username || influencer.handle || influencer.custom_name || influencer.fullname;
            const topicTags = await getRelevantTopicTagsByInfluencer(
                {
                    query: { q: userHandle, limit: 60, platform },
                },
                { req, res },
            );
            const generatedTagRelevance =
                topicTags.data.length === 0 ? [] : await getTopicsAndRelevance(topicTags.data);
            return {
                ...influencer,
                influencer_niche_graph: generatedTagRelevance,
            };
        }),
    );

    const fulfilledInfluencers = modifiedInfluencers
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<SavedSearchTableInfluencer>).value);

    await saveSearchResultsDbCall(fulfilledInfluencers);

    return res.status(httpCodes.OK).json({ message: 'ok' });
};

export default ApiHandler({ postHandler });
