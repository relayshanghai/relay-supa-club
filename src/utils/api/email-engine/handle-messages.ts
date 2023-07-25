import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';
import { GMAIL_INBOX, GMAIL_SENT, testAccount } from 'src/utils/api/email-engine/prototype-mocks';
import { nextFetch } from 'src/utils/fetcher';
import type { EmailSearchPostRequestBody, EmailSearchPostResponseBody } from 'pages/api/email-engine/search';
import type { ListEmailsPostRequestBody, ListEmailsPostResponseBody } from 'pages/api/email-engine/list-emails';
import type { GetEmailPostRequestBody, GetEmailPostResponseBody } from 'pages/api/email-engine/email-text';
import type { SendEmailRequestBody, SendEmailResponseBody } from 'types/email-engine/account-account-submit-post';

export const getInBoxMessages = async () => {
    const body: ListEmailsPostRequestBody = {
        account: testAccount,
        mailboxPath: GMAIL_INBOX,
    };
    const { messages, pages } = await nextFetch<ListEmailsPostResponseBody>('email-engine/list-emails', {
        method: 'POST',
        body,
    });
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

export const getMessageText = async (textId: string) => {
    const body: GetEmailPostRequestBody = {
        account: testAccount,
        textId: textId,
    };
    const { plain, html } = await nextFetch<GetEmailPostResponseBody>('email-engine/email-text', {
        method: 'POST',
        body,
    });
    return { plain, html };
};

export const sendMessage = async (body: SendEmailRequestBody) => {
    const res = await nextFetch<SendEmailResponseBody>('email-engine/send-email', { method: 'POST', body });
    return res;
};
