import { NextApiRequest, NextApiResponse } from 'next';
import { CampaignWithCompanyCreators, getCampaignWithCompanyCreators } from 'src/utils/api/db';

export type CampaignsIndexGetQuery = {
    id: string;
};

export type CampaignsIndexGetResult = CampaignWithCompanyCreators;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id: companyId } = req.query as CampaignsIndexGetQuery;

        const { data, error } = await getCampaignWithCompanyCreators(companyId);

        if (error) return res.status(500).json(error);

        return res.status(200).json(data);
    }
    return res.status(400).end();
}
