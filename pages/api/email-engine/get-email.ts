import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';

import { sendEmail } from 'src/utils/api/email-engine';
import { serverLogger } from 'src/utils/logger-server';

// text.id is the id to query for the text, not messageId

export type GetEmailPostRequestBody = any & {
    account: string;
};
export type GetEmailPostResponseBody = any;
const postHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { account, ...body } = req.body as GetEmailPostRequestBody;
    try {
        const result: GetEmailPostResponseBody = await sendEmail(body, account);
        return res.status(httpCodes.OK).json(result);
    } catch (error: any) {
        serverLogger(error, 'error');
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
            error: error?.message || 'Internal server error',
        });
    }
};

export default ApiHandler({
    postHandler,
});
