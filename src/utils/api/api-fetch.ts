import type { ApiPayload } from './types';

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

    let content = null;

    const contentType = response.headers.get('content-type') || '';

    if (!response.bodyUsed && contentType.indexOf('application/json') !== -1) {
        content = await response.json();
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

    return content as T;
};
