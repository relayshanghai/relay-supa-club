import type { ApiPayload } from '../types';
import { IQDATA_URL } from '.';
import { headers } from 'src/utils/api/iqdata/constants';

/**
 * For fetching API's externally or internally
 */
export const apiFetch = async <T = any>(url: string, payload: ApiPayload, options: RequestInit = {}) => {
    const urlParams = new URLSearchParams(payload.query).toString();

    if (payload.path) {
        for (const [key, value] of Object.entries(payload.path)) {
            url = url.replace(`{${key}}`, value);
        }
    }

    if (urlParams !== '') {
        url = `${url}?${urlParams}`;
    }

    if (payload.body) {
        options.method = 'POST';
        options.body = JSON.stringify(payload.body);
        options.headers = headers;
    }

    const response = await fetch(IQDATA_URL + url, options).catch((err) => {
        return new Error(err);
    });

    if (response instanceof Error) {
        throw response;
    }

    let content = null;

    const contentType = response.headers.get('content-type') || '';

    if (!response.bodyUsed && contentType.indexOf('application/json') !== -1) {
        content = await response.json();
    }

    if (!response.bodyUsed && contentType.indexOf('application/json') === -1) {
        content = await response.text();
    }

    return content as T;
};
