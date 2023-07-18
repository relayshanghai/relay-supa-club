import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { SendEmailRequestBody, SendEmailResponseBody } from 'src/utils/api/email-engine';
import { sendEmail } from 'src/utils/api/email-engine';
import { serverLogger } from 'src/utils/logger-server';

export type SendEmailPostRequestBody = SendEmailRequestBody & {
    account: string;
};
export type SendEmailPostResponseBody = SendEmailResponseBody;
const postHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { account, ...body } = req.body as SendEmailPostRequestBody;
    try {
        const result: SendEmailPostResponseBody = await sendEmail(body, account);
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
