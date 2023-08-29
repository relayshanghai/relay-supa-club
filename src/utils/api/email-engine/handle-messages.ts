import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';
import { GMAIL_INBOX, GMAIL_SENT, GMAIL_SEEN_SPECIAL_USE_FLAG } from 'src/utils/api/email-engine/prototype-mocks';
import { nextFetch } from 'src/utils/fetcher';
import type { EmailSearchPostRequestBody, EmailSearchPostResponseBody } from 'pages/api/email-engine/search';
import type { GetEmailPostRequestBody, GetEmailPostResponseBody } from 'pages/api/email-engine/email-text';
import type { SendEmailResponseBody } from 'types/email-engine/account-account-submit-post';
import type { ReplyEmailPostRequestBody } from 'pages/api/email-engine/send-email';
import type { UpdateMessagePutRequestBody } from 'pages/api/email-engine/update-message';
import type { UpdateMessagePutResponseBody } from 'types/email-engine/account-account-message-put';

export const getInboxThreadMessages = async (message: MessagesGetMessage, account: string) => {
    const body: EmailSearchPostRequestBody = {
        account,
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

export const getSentThreadMessages = async (message: MessagesGetMessage, account: string) => {
    const body: EmailSearchPostRequestBody = {
        account,
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

export const getMessageText = async (textId: string, account: string) => {
    const body: GetEmailPostRequestBody = {
        account,
        textId: textId,
    };
    const { plain, html } = await nextFetch<GetEmailPostResponseBody>('email-engine/email-text', {
        method: 'POST',
        body,
    });
    return { plain, html };
};

export const sendReply = async (replyBody: ReplyEmailPostRequestBody['body'], account: string) => {
    const body = {
        account,
        ...replyBody,
    };
    const res = await nextFetch<SendEmailResponseBody>('email-engine/send-email', { method: 'POST', body });
    return res;
};

export const updateMessageAsSeen = async (messageId: string, account: string) => {
    const body: UpdateMessagePutRequestBody = {
        account,
        messageId: messageId,
        flags: {
            add: [GMAIL_SEEN_SPECIAL_USE_FLAG],
        },
    };

    const res = await nextFetch<UpdateMessagePutResponseBody>('email-engine/update-message', {
        method: 'PUT',
        body,
    });
    return res;
};
