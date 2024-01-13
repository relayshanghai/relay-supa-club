import type { MailboxSearchOptions, SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import { apiFetch } from './api-fetch';

type SearchMessagesQuery = {
    path?: string;
    page?: number;
    pageSize?: number;
    documentStore?: boolean;
    exposeQuery?: boolean;
};

type SearchMessagesBody = {
    search?: MailboxSearchOptions;
    documentQuery?: any;
};

type SearchMessagesResponse = {
    total: number;
    page: number;
    pages: number;
    messages: SearchResponseMessage[];
};

type SearchMessagesFn = (
    account: string,
    body: SearchMessagesBody,
    query?: SearchMessagesQuery,
) => Promise<SearchMessagesResponse>;

export const searchMessages: SearchMessagesFn = async (account, body, query = {}) => {
    query.documentStore = !query.path ? true : false;
    body.search = body.search ?? {};

    const response = await apiFetch<SearchMessagesResponse, { query?: SearchMessagesQuery; body: SearchMessagesBody }>(
        `/account/${account}/search`,
        { query, body },
    );

    return response.content;
};
