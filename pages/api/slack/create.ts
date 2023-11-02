import type { NextApiResponse, NextApiRequest } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import {
    handleCompanyUpdateMessage,
    handleNewCompanyMessage,
    handleNewProfileMessage,
} from 'src/utils/api/slack/handle-messages';
import { serverLogger } from 'src/utils/logger-server';

// This api is a Supabase database webhook. It is triggered when a new row is inserted into the profiles table or a new row is inserted or updated in companies table. The webhook sends a Slack message to the channel specified in the Slack webhook URL.
// Look at docs>supabase.md>database-webhook section for more info how this is set up on supabase.
async function postHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.query.token !== process.env.SLACK_WEBHOOK) {
        return res.status(httpCodes.UNAUTHORIZED).json({});
    }

    const URL = req.query.token;

    if (URL) {
        try {
            await handleNewProfileMessage(req, URL);
            await handleNewCompanyMessage(req, URL);
            await handleCompanyUpdateMessage(req, URL);
            return res.status(httpCodes.OK).json({});
        } catch (error) {
            serverLogger(error);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.NOT_FOUND).json({});
}

export default ApiHandler({
    postHandler,
});
