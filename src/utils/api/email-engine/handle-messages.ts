import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';
import { GMAIL_INBOX, GMAIL_SENT, testAccount } from 'src/utils/api/email-engine/prototype-mocks';
import { nextFetch } from 'src/utils/fetcher';
import type { EmailSearchPostRequestBody, EmailSearchPostResponseBody } from 'pages/api/email-engine/search';
import type { ListEmailsPostRequestBody } from 'pages/api/email-engine/list-emails';

export const getAccountMessages = async () => {
    const body: ListEmailsPostRequestBody = {
        account: testAccount,
    };
    const { messages, pages } = await nextFetch('email-engine/list-emails', { method: 'POST', body });
    return { messages, pages };
};

export const getInboxThreadMessages = async (message: MessagesGetMessage) => {
    const body: EmailSearchPostRequestBody = {
        account: testAccount,
        mailboxPath: GMAIL_INBOX,
        search: {
            threadId: message.threadId,
        },
    };
    const { messages: inboxThreadMessages } = await nextFetch<EmailSearchPostResponseBody>('email-engine/search', {
        method: 'POST',
        body,
    });
    return inboxThreadMessages;
};

export const getSentThreadMessages = async (message: MessagesGetMessage) => {
    const body: EmailSearchPostRequestBody = {
        account: testAccount,
        mailboxPath: GMAIL_SENT,
        search: {
            threadId: message.threadId,
        },
    };

    const { messages: sentThreadMessages } = await nextFetch<EmailSearchPostResponseBody>('email-engine/search', {
        method: 'POST',
        body,
    });
    return sentThreadMessages;
};
