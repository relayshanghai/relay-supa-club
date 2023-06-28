import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { getCampaignSales } from 'src/utils/api/db/calls/campaign-sales';
import { serverLogger } from 'src/utils/logger-server';

type SalesGetBody = string;

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
    try {
        const companyId = req.body as SalesGetBody;
        const sales = await getCampaignSales(companyId);

        return res.status(httpCodes.OK).json(sales);
    } catch (error) {
        serverLogger(error, 'error');
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
};

export default handler;
