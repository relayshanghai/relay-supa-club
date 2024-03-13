import axios, { type AxiosError, type AxiosResponse } from 'axios';
import awaitToError from 'src/utils/await-to-error';
import type { AccountSearchPost, SearchEmailParam, SearchResponseMessage } from './account-search-types';
import type { AccountMessage } from './account-get-message';
import type { EmailEnginePaginatedAccount } from './account';
import type { SendEmailRequestBody, SendEmailResponseBody } from './account-submit-message';

export const EMAIL_ENGINE_API_URL = `${process.env.EMAIL_ENGINE_API_URL || 'http://localhost:4000'}/v1`;

const EMAIL_ENGINE_API_KEY = process.env.EMAIL_ENGINE_API_KEY;

if (!EMAIL_ENGINE_API_KEY) {
    throw new Error('EMAIL_ENGINE_API_KEY is not defined');
}

export type EmailTemplate = {
    name: string;
    subject: string;
    html: string;
};

export default class EmailEngineService {
    static service: EmailEngineService = new EmailEngineService();
    static getService(): EmailEngineService {
        return EmailEngineService.service;
    }

    apiClient = axios.create({
        baseURL: EMAIL_ENGINE_API_URL,
        params: {
            access_token: EMAIL_ENGINE_API_KEY,
        },
    });

    /**
     *
     * @param template
     * @returns inserted id from email engine
     */
    async createTemplate(template: EmailTemplate): Promise<string> {
        const response = await this.apiClient.post('/templates/template', {
            account: null,
            name: template.name,
            description: '',
            format: 'html',
            content: {
                subject: template.subject,
                text: '',
                html: template.html,
                previewText: '',
            },
        });
        return response.data.id;
    }
    async updateTemplate(id: string, template: EmailTemplate): Promise<void> {
        await this.apiClient.put(`/templates/template/${id}`, {
            name: template.name,
            description: '',
            format: 'html',
            content: {
                subject: template.subject,
                text: '',
                html: template.html,
                previewText: '',
            },
        });
    }

    async getAccounts(page = 0) {
        const [err, result] = await awaitToError<AxiosError, AxiosResponse<EmailEnginePaginatedAccount>>(
            this.apiClient.get<EmailEnginePaginatedAccount>(`/accounts?page=${page}&pageSize=250`),
        );
        if (err) {
            throw new Error(err.message);
        }
        return result.data;
    }

    async getAllAccounts(page = 0) {
        const result = await this.getAccounts(page);
        const { accounts } = result;
        if (result.pages > page) {
            const nextAccounts = await Promise.all(
                [...Array(result.pages)].map(async (_, i) => this.getAccounts(page + i)),
            );
            accounts.push(...nextAccounts.map((e) => e.accounts).flat());
        }
        return accounts;
    }

    async getEmailByAccountId(
        accountId: string,
        param: SearchEmailParam = {
            page: 1,
            search: {},
        },
    ) {
        const [err, result] = await awaitToError<AxiosError, AxiosResponse<AccountSearchPost>>(
            this.apiClient.post<AccountSearchPost>(
                `/account/${accountId}/search?documentStore=true&page=${param.page}`,
                {
                    search: param.search,
                    documentQuery: param.documentQuery,
                },
            ),
        );
        if (err) {
            throw new Error(err.message);
        }
        return result.data;
    }

    async getAllEmailsByAccountId(
        emailEngineAccountId: string,
        param: SearchEmailParam = {
            page: 0,
            search: {},
        },
    ): Promise<SearchResponseMessage[]> {
        const page = param.page || 0;
        const result = await this.getEmailByAccountId(emailEngineAccountId, param);
        const emails = result.messages;
        if (result.pages > page) {
            const nextEmails = await Promise.all(
                [...Array(result.pages)].map(async (_, i) =>
                    this.getEmailByAccountId(emailEngineAccountId, { ...param, page: page + i }),
                ),
            );
            emails.push(...nextEmails.map((e) => e.messages).flat());
        }
        return emails;
    }

    async getAccountMessageById(accountId: string, messageId: string): Promise<AccountMessage> {
        const [err, result] = await awaitToError<AxiosError, AxiosResponse<AccountMessage>>(
            this.apiClient.get<AccountMessage>(
                `/account/${accountId}/message/${messageId}?webSafeHtml=true&embedAttachedImages=true&preProcessHtml=true&documentStore=true`,
            ),
        );
        if (err) {
            throw new Error(err.message);
        }
        return result.data;
    }

    async sendEmail(accountId: string, payload: SendEmailRequestBody): Promise<SendEmailResponseBody> {
        const [err, result] = await awaitToError<AxiosError, AxiosResponse<SendEmailResponseBody>>(
            this.apiClient.post<SendEmailResponseBody>(`/account/${accountId}/submit`, payload),
        );
        if (err) {
            throw new Error(err.message);
        }
        return result.data;
    }
}
