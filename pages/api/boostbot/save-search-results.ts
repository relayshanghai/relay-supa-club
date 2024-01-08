import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { saveSearchResults } from 'src/utils/api/boostbot/save-search-results';
import { getRelevantTopicTagsByInfluencer } from 'src/utils/api/iqdata/topics/get-relevant-topic-tags';
import { extractPlatformFromURL } from 'src/utils/extract-platform-from-url';
import type { SearchTableInfluencer } from 'types';
import { getTopicsAndRelevance } from 'src/utils/api/boostbot/get-topic-relevance';

export type SaveSearchResultsBody = {
    influencers: SearchTableInfluencer[];
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const influencers: SearchTableInfluencer[] = req.body.influencers;
    if (!('user_id' in influencers[0])) {
        return res.status(httpCodes.BAD_REQUEST).end();
    }

    const modifiedInfluencers = await Promise.all(
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

    await saveSearchResults(modifiedInfluencers);

    return res.status(httpCodes.OK).end();
};

export default ApiHandler({ postHandler });
