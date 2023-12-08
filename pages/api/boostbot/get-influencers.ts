import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { limiter } from 'src/utils/limiter';
import type { SearchTableInfluencer as BoostbotInfluencer } from 'types';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { searchInfluencers } from 'src/utils/api/iqdata/influencers/search-influencers';
import { SearchInfluencersPayloadRequired } from 'src/utils/api/iqdata/influencers/search-influencers-payload';
import { recordSearchUsage } from 'src/utils/api/db/calls/usages';
import { flattenInfluencerData } from 'src/utils/api/boostbot/helpers';

const GetInfluencersBody = z.object({
    searchPayloads: SearchInfluencersPayloadRequired.array(),
    company_id: z.string(),
    user_id: z.string(),
});

export type GetInfluencersBody = z.input<typeof GetInfluencersBody>;
export type GetInfluencersResponse = BoostbotInfluencer[];

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const result = GetInfluencersBody.safeParse(req.body);

    if (!result.success) {
        return res.status(httpCodes.BAD_REQUEST).json(result.error.format());
    }

    const { company_id, user_id, searchPayloads } = result.data;

    // We want a single Boostbot search to cost 5 credits. Each Boostbot search consists of all 3 platforms, calling this endpoint 3 times. This achieves a total of 5.
    const platformCosts = { instagram: 2, tiktok: 2, youtube: 1 };
    const platform = searchPayloads[0].query.platform;
    const cost = platformCosts[platform];
    const { error: recordError } = await recordSearchUsage(company_id, user_id, cost);
    if (recordError) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: recordError });
    }

    const influencersPromises = searchPayloads.map((payload) => limiter.schedule(() => searchInfluencers(payload)));
    const influencersResults = await Promise.all(influencersPromises);
    const topics = searchPayloads.map((p) => p.body.filter?.relevance?.value.split(',').map((topic) => topic.trim()));
    const flattenedAccounts = influencersResults
        .filter((result) => result?.accounts)
        .map((result, index) => {
            return flattenInfluencerData(result, topics[index]).influencers;
        })
        .flat();
    const uniqueInfluencers: GetInfluencersResponse = flattenedAccounts.filter(
        (currentAccount, index, self) =>
            self.findIndex((account) => account.user_id === currentAccount.user_id) === index,
    );

    return res.status(httpCodes.OK).json(uniqueInfluencers);
};

export default ApiHandler({ postHandler });
