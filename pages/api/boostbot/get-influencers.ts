import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { limiter } from 'src/utils/limiter';
import type { CreatorAccount } from 'types';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { createBoostbotInfluencerPayload } from 'src/utils/api/boostbot';
import { searchInfluencers } from 'src/utils/api/iqdata/influencers/search-influencers';
import { platform_enum } from 'src/utils/api/iqdata/influencers/search-influencers-payload';
import { recordSearchUsage } from 'src/utils/api/db/calls/usages';

const GetInfluencersBody = z.object({
    topicClusters: z.string().array().array(),
    platform: platform_enum,
    company_id: z.string(),
    user_id: z.string(),
});

export type CreatorAccountWithTopics = CreatorAccount & { topics: string[] };
export type GetInfluencersBody = z.input<typeof GetInfluencersBody>;
export type GetInfluencersResponse = CreatorAccountWithTopics[];

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const result = GetInfluencersBody.safeParse(req.body);

    if (!result.success) {
        return res.status(httpCodes.BAD_REQUEST).json(result.error.format());
    }

    const { company_id, user_id, topicClusters, platform } = result.data;

    // We want a single Boostbot search to cost 5 credits. Each Boostbot search consists of all 3 platforms, calling this endpoint 3 times. This achieves a total of 5.
    const platformCosts = { instagram: 2, tiktok: 2, youtube: 1 };
    const cost = platformCosts[platform];
    const { error: recordError } = await recordSearchUsage(company_id, user_id, cost);
    if (recordError) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: recordError });
    }

    const influencerPayloads = topicClusters.map(createBoostbotInfluencerPayload(platform));
    const influencersPromises = influencerPayloads.map((payload) => limiter.schedule(() => searchInfluencers(payload)));
    const influencersResults = await Promise.all(influencersPromises);
    const flattenedAccounts = influencersResults
        .map((result, index) =>
            // We want to display the topics for each influencer found, so we add them to the account object
            result.accounts.map((creator) => ({ ...creator.account.user_profile, topics: topicClusters[index] })),
        )
        .flat();
    const uniqueInfluencers: GetInfluencersResponse = flattenedAccounts.filter(
        (currentAccount, index, self) =>
            self.findIndex((account) => account.user_id === currentAccount.user_id) === index,
    );

    return res.status(httpCodes.OK).json(uniqueInfluencers);
};

export default ApiHandler({ postHandler });
