import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { limiter } from 'src/utils/limiter';
import type { CreatorAccount } from 'types';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { createBoostbotInfluencerPayload } from 'src/utils/api/boostbot';
import { searchInfluencers } from 'src/utils/api/iqdata/influencers/search-influencers';
import { platform_enum } from 'src/utils/api/iqdata/influencers/search-influencers-payload';

const GetInfluencersBody = z.object({
    topicClusters: z.string().array().array(),
    platform: platform_enum,
});

export type CreatorAccountWithTopics = CreatorAccount & { topics: string[] };
export type GetInfluencersBody = z.input<typeof GetInfluencersBody>;
export type GetInfluencersResponse = { influencers: CreatorAccountWithTopics[] };

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const result = GetInfluencersBody.safeParse(req.body);

    if (!result.success) {
        return res.status(httpCodes.BAD_REQUEST).json(result.error.format());
    }

    const { topicClusters, platform } = result.data;
    const influencerPayloads = topicClusters.map(createBoostbotInfluencerPayload(platform));
    const influencersPromises = influencerPayloads.map((payload) => limiter.schedule(() => searchInfluencers(payload)));
    const influencersResults = await Promise.all(influencersPromises);
    const flattenedAccounts = influencersResults
        .map((result, index) =>
            // We want to display the topics for each influencer found, so we add them to the account object
            result.accounts.map((creator) => ({ ...creator.account.user_profile, topics: topicClusters[index] })),
        )
        .flat();
    const uniqueInfluencers = flattenedAccounts.filter(
        (currentAccount, index, self) =>
            self.findIndex((account) => account.user_id === currentAccount.user_id) === index,
    );

    return res.status(httpCodes.OK).json({ influencers: uniqueInfluencers });
};

export default ApiHandler({ postHandler });
