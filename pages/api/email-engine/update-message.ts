import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';

import { updateMessage } from 'src/utils/api/email-engine';
import type {
    UpdateMessagePutResponseBody,
    AccountAccountMessagePut,
} from 'types/email-engine/account-account-message-put';

export type UpdateMessagePutRequestBody = AccountAccountMessagePut & {
    account: string;
    messageId: string;
};

const putHandler: NextApiHandler = async (req, res) => {
    const { account, messageId, ...body } = req.body as UpdateMessagePutRequestBody;

    const result: UpdateMessagePutResponseBody = await updateMessage(body, account, messageId);
    return res.status(httpCodes.OK).json(result);
};

export default ApiHandler({ putHandler });
