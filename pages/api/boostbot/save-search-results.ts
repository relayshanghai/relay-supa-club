import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { saveSearchResults } from 'src/utils/api/boostbot/save-search-results';
import type { SearchTableInfluencer } from 'types';

export type SaveSearchResultsBody = {
    influencers: SearchTableInfluencer[];
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    await saveSearchResults(req.body.influencers);

    return res.status(httpCodes.OK);
};

export default ApiHandler({ postHandler });
