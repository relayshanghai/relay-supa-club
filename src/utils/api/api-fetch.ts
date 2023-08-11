import type { ApiPayload } from './types';

const parsePayloadPath = (url: string, payloadPath: ApiPayload['path']) => {
    if (!payloadPath) return url;

    let u = url;

    for (const [key, value] of Object.entries(payloadPath)) {
        u = u.replace(`{${key}}`, encodeURIComponent(value));
    }

    return u;
};

const parsePayloadQuery = (url: string, payloadQuery: ApiPayload['query']) => {
    const urlParams = new URLSearchParams(payloadQuery).toString();

    return urlParams === '' ? url : `${url}?${urlParams}`;
};

const parseResponse = async (response: Response) => {
    let content = null;

    const contentType = response.headers.get('content-type') || '';

    if (!response.bodyUsed && contentType.indexOf('application/json') !== -1) {
        content = await response.json();

        // @todo fix status key patching
        if (Array.isArray(content)) {
            return content;
        }

        content = { ...content, status: response.status };
    }

    // @note leaving this here for iqdata endpoints that return gzip, in-case we need it in the future
    // if (!response.bodyUsed && contentType.indexOf('x-gzip') !== -1) {
    //     const buffer = await response.arrayBuffer();
    //     content = gunzipSync(buffer).toString('utf8');
    //     content = content.trim().replace(/\n/g, ',');
    //     content = JSON.parse(`[${content}]`);
    // }

    if (!response.bodyUsed && contentType.indexOf('application/json') === -1) {
        content = await response.text();
    }

    return content;
};

/**
 * For fetching API's externally or internally
 */
export const apiFetch = async <T = any>(url: string, payload: ApiPayload, options: RequestInit = {}) => {
    url = parsePayloadPath(url, payload.path);
    url = parsePayloadQuery(url, payload.query);

    if (payload.body) {
        options.method = 'POST';
        options.body = JSON.stringify(payload.body);
        options.headers = {
            'content-type': 'application/json',
            ...options.headers,
        };
    }

    const response = await fetch(url, options).catch((err) => {
        if (err instanceof Error) return err;

        return new Error(err);
    });

    if (response instanceof Error && response.name === 'AbortError') {
        return;
    }

    if (response instanceof Error) {
        throw response;
    }

    return parseResponse(response) as T;
};
