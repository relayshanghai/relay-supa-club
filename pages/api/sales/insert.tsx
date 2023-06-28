import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { insertCampagnSales } from 'src/utils/api/db/calls/campaign-sales';
import { serverLogger } from 'src/utils/logger-server';

type SalesInsertBody = {
    campaign_id: string;
    company_id: string;
    amount: number;
};

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
    try {
        const insertionInfo = req.body as SalesInsertBody;
        await insertCampagnSales(insertionInfo);
        return res.status(httpCodes.OK);
    } catch (error) {
        serverLogger(error, 'error');
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
};

export default handler;
