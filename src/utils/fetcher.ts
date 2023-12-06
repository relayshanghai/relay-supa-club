import { getItem } from '@analytics/storage-utils';
import { ANALYTICS_COOKIE_ANON } from './analytics/constants';
import { ANALYTICS_HEADER_NAME } from './analytics/constants';
import { clientLogger } from './logger-client';
import { serverLogger } from './logger-server';

interface ResponseWithError extends Response {
    success?: boolean;
    error?: string;
    error_message?: string;
}

export const handleResError = async (res: ResponseWithError) => {
    const logger = typeof window === 'undefined' ? serverLogger : clientLogger;
    if (!res.status.toString().startsWith('2')) {
        try {
            const contentType = res.headers.get('content-type') || '';

            if (contentType.indexOf('application/json') !== -1) {
                const json = await res.json();
                const errorMessage = `${res.status} ${res.statusText} ${json}`;
                logger(errorMessage);
                throw new Error(errorMessage);
            } else {
                const text = await res.text();
                throw new Error(text);
            }
        } catch (error) {
            if (error instanceof Error) throw error;
            logger(error);
            throw new Error('Something went wrong with the request.');
        }
    }
};

export interface RequestInitWithBody extends RequestInit {
    body?: any;
}

/**
 *
 * @param path will be prefixed by `/api/`
 * @returns fetch .json() data
 * @description fetcher for internal next API routes. Add a type to the generic to get types on your response.
 *  if it encounters an error, it will throw an Error with the error message from the response. Remember to add an `{error: ''}` to api responses.
 * options.body does not need to be stringified.
 * if options.method is POST or PUT, it will set the content-type header to application/json
 * @example `const data = await nextFetch<SomeType>('some/path')`
 */
export const nextFetch = async <T = any>(path: string, options: RequestInitWithBody = {}) => {
    const body = options.body;
    const method = options.method?.toUpperCase();
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        options.headers = {
            'content-type': 'application/json',
            // allow manual override of 'content-type' by placing this after
            ...options.headers,
        };
    }

    // if it's not a string, stringify it
    const stringified = body && typeof body !== 'string' ? JSON.stringify(body) : body;
    const optionsWithBody = { ...options, body: stringified };
    const res = await fetch('/api/' + path, optionsWithBody);
    await handleResError(res);
    const json = await res.json();
    return json as T;
};
/**
 *
 * @param path will be prefixed by `/api/`
 * @returns fetch .json() data
 * @description fetcher for internal next API routes. Add a first type to the generic to enforce type safety on passed queries, Add a second type to the generic to get types on your response.
 *  if it encounters an error, it will throw an Error with the error message from the response. Remember to add an `{error: ''}` to api responses.
 * @example `const data = await nextFetchWithQueries<QueryType, SomeType>('some/path')`
 */
export const nextFetchWithQueries = async <Q extends Record<string, string>, T = any>(
    path: string,
    queries: Q,
    options: RequestInit = {},
) => {
    const anonymous_id = getItem(ANALYTICS_COOKIE_ANON);
    const url = new URL('/api/' + path, window.location.origin);
    for (const key in queries) {
        if (queries.hasOwnProperty(key)) url.searchParams.set(key, queries[key]?.toString());
    }
    options.headers = { ...options.headers, [ANALYTICS_HEADER_NAME]: anonymous_id };
    const res = await fetch(url.toString(), options);
    await handleResError(res);
    const json = await res.json();
    return json as T;
};

/**
 *
 * @param url image url
 * @returns
 * @description this function is used to proxy images to bypass the Chinese firewall. "sptds.icu" is the current instagram profile images domain that does not need the proxy.
 */
export function imgProxy(url: string) {
    const proxyUrl = 'https://image-cache.relay.club/?link=';
    if (!url) return;

    if (/sptds.icu/.test(url)) return url;
    if (/iqfluence.com/.test(url)) return url; //iq data changed the instagram profile image domain from sptds.icu to iqfluence.com on 2023-03-03 tempoerarily

    return proxyUrl + url;
}
