import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';

import { getMessage } from 'src/utils/api/email-engine';
import type { AccountAccountMessageGet } from 'types/email-engine/account-account-message-get';

export type GetMessagePostRequestBody = {
    account: string;
    messageId: string;
    textType?: string;
};
export type GetMessagePostResponseBody = AccountAccountMessageGet;

const postHandler: NextApiHandler = async (req, res) => {
    const { account, messageId } = req.body as GetMessagePostRequestBody;

    const result: GetMessagePostResponseBody = await getMessage(account, messageId);
    return res.status(httpCodes.OK).json(result);
};

export default ApiHandler({ postHandler });
