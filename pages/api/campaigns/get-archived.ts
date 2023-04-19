import { getArchivedCampaignWithCompanyCreators } from 'src/utils/api/db';
import type { CampaignWithCompanyCreators } from 'src/utils/api/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { serverLogger } from 'src/utils/logger-server';
import httpCodes from 'src/constants/httpCodes';

export type CampaignsIndexGetQuery = {
    id: string;
};

export type CampaignsIndexGetResult = CampaignWithCompanyCreators[];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }

    try {
        const { id: companyId } = req.query as CampaignsIndexGetQuery;
        if (!companyId) {
            return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing company id' });
        }
        const data = await getArchivedCampaignWithCompanyCreators(companyId);

        const result: CampaignsIndexGetResult = data;

        return res.status(httpCodes.OK).json(result);
    } catch (error) {
        serverLogger(error, 'error');
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
}
