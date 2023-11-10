import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { searchInfluencersListWithContext as searchInfluencersList } from 'src/utils/api/iqdata/influencers/search-influencers';
import type { CreatorPlatform } from 'types';

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const { username, platform } = req.query as {
        username: string;
        platform: CreatorPlatform;
    };

    if (!username || !platform) {
        return res.status(httpCodes.BAD_REQUEST).json({ message: 'Username and platform are required' });
    }

    const parameters = {
        username,
        platform,
    };

    const result = await searchInfluencersList(parameters, { req, res });

    return res.status(httpCodes.OK).json(result);
}

export default ApiHandler({
    getHandler,
});
