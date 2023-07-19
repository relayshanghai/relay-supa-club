import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';

import { getEmails } from 'src/utils/api/email-engine';
import { GMAIL_INBOX } from 'src/utils/api/email-engine/prototype-mocks';
import type { AccountAccountMessagesGet } from 'types/email-engine/account-account-messages-get';

export type ListEmailsPostRequestBody = {
    account: string;
    // mailboxPath: string; // using mock for now
    page?: number;
    pageSize?: number;
};
export type ListEmailsPostResponseBody = AccountAccountMessagesGet;

const postHandler: NextApiHandler = async (req, res) => {
    const { account } = req.body as ListEmailsPostRequestBody;

    const result: ListEmailsPostResponseBody = await getEmails(account, GMAIL_INBOX);
    return res.status(httpCodes.OK).json(result);
};

export default ApiHandler({ postHandler });
