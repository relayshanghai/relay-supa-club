import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';

import { getEmailText } from 'src/utils/api/email-engine';
import type { AccountAccountTextTextGetResponse } from 'types/email-engine/account-account-text-text-get';

export type GetEmailPostRequestBody = {
    account: string;
    /* `text.id` is the id to query for the text, not `messageId` */
    emailId: string;
};
export type GetEmailPostResponseBody = AccountAccountTextTextGetResponse;

const postHandler: NextApiHandler = async (req, res) => {
    const { account, emailId } = req.body as GetEmailPostRequestBody;

    const result: GetEmailPostResponseBody = await getEmailText(account, emailId);
    return res.status(httpCodes.OK).json(result);
};

export default ApiHandler({ postHandler });
