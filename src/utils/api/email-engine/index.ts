import type { SendEmailRequestBody, SendEmailResponseBody } from 'types/email-engine/account-account-submit-post';
import type { GenerateAuthLinkRequestBody, GenerateAuthLinkResponse } from 'types/email-engine/authentication-form';
import { emailEngineApiFetch } from './fetcher';
import { GMAIL_INBOX } from './prototype-mocks';
import type { AccountAccountMessagesGet } from 'types/email-engine/account-account-messages-get';
import type { AccountAccountTextTextGetResponse, TextType } from 'types/email-engine/account-account-text-text-get';
import type {
    AccountAccountSearchPost,
    AccountAccountSearchPostRequestBody,
    MailboxSearchOptions,
} from 'types/email-engine/account-account-search-post';

const authLinkPath = 'authentication/form';

export const generateAuthLink = async (body: GenerateAuthLinkRequestBody) => {
    const res = await emailEngineApiFetch<GenerateAuthLinkResponse>(authLinkPath, { method: 'POST', body });
    return res.url;
};

const sendEmailPath = (account: string) => `account/${encodeURIComponent(account)}/submit`;

export const sendEmail = async (body: SendEmailRequestBody, account: string) =>
    await emailEngineApiFetch<SendEmailResponseBody>(sendEmailPath(account), { method: 'POST', body });

const getEmailsPath = (account: string, mailboxPath: string, page = 0, pageSize = 20, documentStore = false) =>
    `account/${encodeURIComponent(account)}/messages?path=${encodeURIComponent(
        mailboxPath,
    )}&page=${page}&pageSize=${pageSize}&documentStore=${documentStore}`;

export const getEmails = async (account: string, mailboxPath = GMAIL_INBOX) =>
    await emailEngineApiFetch<AccountAccountMessagesGet>(getEmailsPath(account, mailboxPath));

const getEmailTextPath = (account: string, messageId: string, textType: TextType) =>
    `account/${encodeURIComponent(account)}/text/${encodeURIComponent(messageId)}?textType=${textType}`;
export const getEmailText = async (account: string, messageId: string, textType: TextType = '*') =>
    await emailEngineApiFetch<AccountAccountTextTextGetResponse>(getEmailTextPath(account, messageId, textType));

const searchMailboxPath = (account: string, mailboxPath: string, page = 0, pageSize = 20) =>
    `account/${encodeURIComponent(account)}/search?path=${encodeURIComponent(
        mailboxPath,
    )}&page=${page}&pageSize=${pageSize}`;

export const searchMailbox = async (
    account: string,
    search: MailboxSearchOptions,
    mailboxPath = GMAIL_INBOX,
    page = 0,
    pageSize = 20,
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
