import type { ApiPayload } from './types';

const parsePayloadPath = (url: string, payloadPath: ApiPayload['path']) => {
    if (!payloadPath) return url;

    let u = url;

    for (const [key, value] of Object.entries(payloadPath)) {
        u = u.replace(`{${key}}`, encodeURIComponent(value));
    }

    return u;
};

const preparePayloadQuery = (url: string, payloadQuery: ApiPayload['query']) => {
    const urlParams = new URLSearchParams(payloadQuery).toString();

    return urlParams === '' ? url : `${url}?${urlParams}`;
};

const parseResponse = async <T = any>(res: Response): Promise<T> => {
    const response = res.clone();

    if (response.bodyUsed) {
        throw new Error('Cannot read response. Body already used');
    }

    const contentType = response.headers.get('content-type') || '';

    if (contentType.indexOf('application/json') !== -1) {
        return await response.json();
    }

    // @note leaving this here for iqdata endpoints that return gzip, in-case we need it in the future
    // if (!response.bodyUsed && contentType.indexOf('x-gzip') !== -1) {
    //     const buffer = await response.arrayBuffer();
    //     content = gunzipSync(buffer).toString('utf8');
    //     content = content.trim().replace(/\n/g, ',');
    //     content = JSON.parse(`[${content}]`);
    // }

    // always parse as "text" by default
    return (await response.text()) as T;
};

const unwrapResponse = async <T = any>(res: Response): Promise<{ response: Response; content: T }> => {
    const content = await parseResponse<T>(res);

    return {
        response: res,
        content,
    };
};

const isApiPayload = (payload: any): payload is ApiPayload => {
    const isObject = typeof payload === 'object' && payload !== null && !Array.isArray(payload);
    return isObject && ('path' in payload || 'query' in payload || 'body' in payload);
};

export function apiFetch<TRes = void>(
    url: string,
    payload?: null,
    options?: RequestInit,
): Promise<{ response: Response; content: TRes extends void ? 'API Response Type is required' : TRes }>;

export function apiFetch<TRes = void, TReq = void>(
    url: string,
    payload: TReq extends void ? 'API Request Type is required' : TReq,
    options?: RequestInit,
): Promise<{ response: Response; content: TRes extends void ? 'API Response Type is required' : TRes }>;

/**
 * For fetching API's externally or internally
 */
export async function apiFetch<TRes = void, TReq = void>(
    url: string,
    payload?: TReq extends void ? 'API Request Type is required' : TReq,
    options?: RequestInit,
) {
    const _options = options ?? {};

    if (isApiPayload(payload)) {
        url = parsePayloadPath(url, payload.path);
        url = preparePayloadQuery(url, payload.query);

        if (payload.body) {
            _options.method = 'POST';
            _options.body = JSON.stringify(payload.body);
            _options.headers = {
                'content-type': 'application/json',
                ..._options.headers,
            };
        }
    }

    const response = await fetch(url, _options).catch((err) => {
        if (err instanceof Error) return err;
        return new Error(err);
    });

    if (response instanceof Error) {
        throw response;
    }

    const unwrapped = await unwrapResponse<TRes>(response);

    return unwrapped;
}
