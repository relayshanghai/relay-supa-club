import type { NextApiResponse, NextApiRequest } from 'next';
import httpCodes from 'src/constants/httpCodes';
import {
    handleCompanyUpdateMessage,
    handleNewCompanyMessage,
    handleNewProfileMessage,
} from 'src/utils/api/slack/handle-messages';
import { serverLogger } from 'src/utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.query.token !== process.env.SLACK_WEBHOOK) {
        return res.status(httpCodes.UNAUTHORIZED).json({});
    }

    const URL = req.query.token;

    if (req.method === 'POST' && URL) {
        try {
            await handleNewProfileMessage(req, URL);
            await handleNewCompanyMessage(req, URL);
            await handleCompanyUpdateMessage(req, URL);
            return res.status(httpCodes.OK).json({});
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.NOT_FOUND).json({});
}
