import type { SendEmailRequestBody, SendEmailResponseBody } from 'types/email-engine/account-account-submit-post';
import type { GenerateAuthLinkRequestBody, GenerateAuthLinkResponse } from 'types/email-engine/authentication-form';
import { emailEngineApiFetch } from './fetcher';
import type { AccountAccountMessagesGet } from 'types/email-engine/account-account-messages-get';
import type { AccountAccountTextTextGetResponse, TextType } from 'types/email-engine/account-account-text-text-get';
import type {
    AccountAccountSearchPost,
    AccountAccountSearchPostRequestBody,
    MailboxSearchOptions,
} from 'types/email-engine/account-account-search-post';
import type { AccountAccountMailboxesGetResponse } from 'types/email-engine/account-account-mailboxes-get';
import type { AccountAccountMessageGet } from 'types/email-engine/account-account-message-get';
import type { OutboxGet } from 'types/email-engine/outbox-get';
import type { OutboxQueueidDelete } from 'types/email-engine/outbox-queueid-delete';
import type {
    AccountAccountMessagePut,
    UpdateMessagePutResponseBody,
} from 'types/email-engine/account-account-message-put';
import type { TemplatesTemplateGetResponse } from 'types/email-engine/templates-template-get';

// PATHS

const authLinkPath = 'authentication/form';

const getMailboxesPath = (account: string) => `account/${encodeURIComponent(account)}/mailboxes`;

const sendEmailPath = (account: string) => `account/${encodeURIComponent(account)}/submit`;

const getEmailsPath = (account: string, mailboxPath: string, page = 0, pageSize = 20, documentStore = true) =>
    `account/${encodeURIComponent(account)}/messages?${new URLSearchParams({
        page: String(page),
        path: mailboxPath,
        pageSize: String(pageSize),
        documentStore: String(documentStore),
    })}`;

const getEmailPath = (account: string, messageId: string, textType: TextType | null, documentStore = true) => {
    const urlParams = new URLSearchParams({
        documentStore: String(documentStore),
    });
    if (textType) {
        urlParams.append('textType', textType);
    }
    const base64MessageId = Buffer.from(messageId).toString('base64');
    return `account/${encodeURIComponent(account)}/message/${base64MessageId}?${urlParams}`;
};

const updateEmailPath = (account: string, messageId: string) =>
    `account/${encodeURIComponent(account)}/message/${encodeURIComponent(messageId)}`;

const getEmailTextPath = (account: string, messageId: string, textType: TextType, documentStore = true) =>
    `account/${encodeURIComponent(account)}/text/${encodeURIComponent(messageId)}?${new URLSearchParams({
        textType,
        documentStore: String(documentStore),
    })}`;

const searchMailboxPath = (account: string, mailboxPath: string, page = 0, pageSize = 20, documentStore = true) =>
    `account/${encodeURIComponent(account)}/search?${new URLSearchParams({
        path: mailboxPath,
        page: String(page),
        pageSize: String(pageSize),
        documentStore: String(documentStore),
    })}`;

const getTemplateInfoPath = (templateId: string) => `templates/template/${encodeURIComponent(templateId)}`;

export const generateAuthLink = async (body: GenerateAuthLinkRequestBody) => {
    const res = await emailEngineApiFetch<GenerateAuthLinkResponse>(authLinkPath, { method: 'POST', body });
    return res.url;
};

export const outboxPath = (page = 0, pageSize = 100) =>
    `outbox?${new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
    })}`;

export const outboxDeletePath = (queueId: string) => `outbox/${encodeURIComponent(queueId)}
    `;

// CALLS

export const getMailboxes = async (account: string) =>
    await emailEngineApiFetch<AccountAccountMailboxesGetResponse>(getMailboxesPath(account));

export const sendEmail = async (body: SendEmailRequestBody, account: string) =>
    await emailEngineApiFetch<SendEmailResponseBody>(sendEmailPath(account), { method: 'POST', body });

export const getEmails = async (account: string, mailboxPath: string) =>
    await emailEngineApiFetch<AccountAccountMessagesGet>(getEmailsPath(account, mailboxPath));

export const getMessage = async (account: string, messageId: string, textType: TextType | null = '*') => {
    console.log('getMessage', account, messageId, textType, getEmailPath(account, messageId, textType));
    return await emailEngineApiFetch<AccountAccountMessageGet>(getEmailPath(account, messageId, textType));
};

export const getEmailText = async (account: string, emailId: string, textType: TextType = '*') =>
    await emailEngineApiFetch<AccountAccountTextTextGetResponse>(getEmailTextPath(account, emailId, textType));

export const updateMessage = async (body: AccountAccountMessagePut, account: string, messageId: string) =>
    await emailEngineApiFetch<UpdateMessagePutResponseBody>(updateEmailPath(account, messageId), {
        method: 'PUT',
        body,
    });

export const searchMailbox = async (
    account: string,
    search: MailboxSearchOptions,
    mailboxPath: string,
    page = 0,
    pageSize = 1000, // entries per page
) => {
    const body: AccountAccountSearchPostRequestBody = { search };
    return await emailEngineApiFetch<AccountAccountSearchPost>(
        searchMailboxPath(account, mailboxPath, page, pageSize),
        {
            method: 'POST',
            body,
        },
    );
};

/** outbox is global for all accounts
 * This function gets the entire outbox
 */
export const getOutbox = async () => {
    const firstRes = await emailEngineApiFetch<OutboxGet>(outboxPath());
    if (firstRes.pages === 1) return firstRes.messages;
    const pagesLeft = firstRes.pages - 1;
    const rest = [...firstRes.messages];
    for (let i = 1; i <= pagesLeft; i++) {
        const res = await emailEngineApiFetch<OutboxGet>(outboxPath(i));
        rest.push(...res.messages);
    }
    return rest;
};

export const deleteEmailFromOutbox = async (queueId: string) =>
    await emailEngineApiFetch<OutboxQueueidDelete>(outboxDeletePath(queueId), { method: 'DELETE' });

export const getTemplateInfo = async (templateId: string) =>
    await emailEngineApiFetch<TemplatesTemplateGetResponse>(getTemplateInfoPath(templateId));
