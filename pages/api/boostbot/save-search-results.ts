import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { saveSearchResults } from 'src/utils/api/boostbot/save-search-results';
import type { BoostbotInfluencer } from './get-influencers';

export type SaveSearchResultsBody = {
    influencers: BoostbotInfluencer[];
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    await saveSearchResults(req.body.influencers);

    return res.status(httpCodes.OK);
};

export default ApiHandler({ postHandler });
