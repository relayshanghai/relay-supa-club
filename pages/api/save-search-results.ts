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

    await saveSearchResultsDbCall(influencers);

    return res.status(httpCodes.OK).json({ message: 'ok' });
};

export default ApiHandler({ postHandler });
