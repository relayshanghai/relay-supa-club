import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { CampaignWithCompanyCreators, getCampaignWithCompanyCreators } from 'src/utils/api/db';
import { checkSessionIdMatchesID } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger';

export type CampaignsIndexGetQuery = {
    id: string;
    profile_id: string;
};

export type CampaignsIndexGetResult = CampaignWithCompanyCreators[];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }

    try {
        const { id: companyId, profile_id } = req.query as CampaignsIndexGetQuery;
        if (!companyId) {
            return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing company id' });
        }
        if (!(await checkSessionIdMatchesID(profile_id, req, res))) {
            return res.status(httpCodes.UNAUTHORIZED).json({});
        }

        const data = await getCampaignWithCompanyCreators(companyId);

        const result: CampaignsIndexGetResult = data;

        return res.status(httpCodes.OK).json(result);
    } catch (error) {
        serverLogger(error, 'error');
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
}
