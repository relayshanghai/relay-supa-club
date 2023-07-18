import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';

import { sendEmail } from 'src/utils/api/email-engine';

export type GetEmailPostRequestBody = any & {
    account: string;
};
export type GetEmailPostResponseBody = any;
const postHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { account, ...body } = req.body as GetEmailPostRequestBody;

    const result: GetEmailPostResponseBody = await sendEmail(body, account);
    return res.status(httpCodes.OK).json(result);
};

export default ApiHandler({ postHandler });
