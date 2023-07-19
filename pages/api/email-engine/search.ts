import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { searchMailbox } from 'src/utils/api/email-engine';

import { GMAIL_INBOX } from 'src/utils/api/email-engine/prototype-mocks';
import type { AccountAccountSearchPost, MailboxSearchOptions } from 'types/email-engine/account-account-search-post';

export type EmailSearchPostRequestBody = {
    account: string;
    search: MailboxSearchOptions;
    // mailboxPath: string; // using mock for now
    page?: number;
    pageSize?: number;
};
export type EmailSearchPostResponseBody = AccountAccountSearchPost;

const postHandler: NextApiHandler = async (req, res) => {
    const { account, search, page, pageSize } = req.body as EmailSearchPostRequestBody;

    const result: EmailSearchPostResponseBody = await searchMailbox(account, search, GMAIL_INBOX, page, pageSize);
    return res.status(httpCodes.OK).json(result);
};

export default ApiHandler({ postHandler });
