import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { CampaignWithCompanyCreators, getCampaignWithCompanyCreators } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger';

export type CampaignsIndexGetQuery = {
    id: string;
};

export type CampaignsIndexGetResult = CampaignWithCompanyCreators[];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { id: companyId } = req.query as CampaignsIndexGetQuery;
            const data = await getCampaignWithCompanyCreators(companyId);

            const result: CampaignsIndexGetResult = data;

            return res.status(httpCodes.OK).json(result);
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }
    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
