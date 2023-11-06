import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import { searchInfluencersWithContext as searchInfluencers } from 'src/utils/api/iqdata/influencers/search-influencers';
import type { SearchInfluencersPayload } from 'src/utils/api/iqdata/influencers/search-influencers-payload';
import type { CreatorPlatform } from 'types';

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const { username, platform } = req.query as {
        username: string;
        platform: CreatorPlatform;
    };

    const parameters: SearchInfluencersPayload = {
        query: { platform, auto_unhide: true },
        body: {
            filter: {
                username: {
                    value: username[0] === '@' ? username.slice(1) : username,
                    operator: 'exact',
                },
            },
        },
    };

    const result = await searchInfluencers(parameters, { req, res });

    return res.status(200).json(result);
}

export default ApiHandler({
    getHandler,
});
