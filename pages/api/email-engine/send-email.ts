import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';

import { sendEmail } from 'src/utils/api/email-engine';
import type { SendEmailRequestBody, SendEmailResponseBody } from 'types/email-engine/account-account-submit-post';

export type SendEmailPostRequestBody = SendEmailRequestBody & {
    account: string;
};
export type SendEmailPostResponseBody = SendEmailResponseBody;
const postHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { account, ...body } = req.body as SendEmailPostRequestBody;

    const result: SendEmailPostResponseBody = await sendEmail(body, account);
    return res.status(httpCodes.OK).json(result);
};

export default ApiHandler({ postHandler });
