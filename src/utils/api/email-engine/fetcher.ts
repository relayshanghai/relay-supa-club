import type { RequestInitWithBody } from 'src/utils/fetcher';
import { handleResError } from 'src/utils/fetcher';

export const EMAIL_ENGINE_API_URL = process.env.EMAIL_ENGINE_API_URL
    ? process.env.EMAIL_ENGINE_API_URL + '/v1/'
    : 'http://localhost:4000/v1/';

const EMAIL_ENGINE_API_KEY = process.env.EMAIL_ENGINE_API_KEY;

if (!EMAIL_ENGINE_API_KEY) {
    throw new Error('EMAIL_ENGINE_API_KEY is not defined');
}
const authHeaders = {
    Authorization: `Bearer ${EMAIL_ENGINE_API_KEY}`,
};
/**
 * @deprecated
 */
export const emailEngineApiFetch = async <T = any>(path: string, passedOptions: RequestInitWithBody = {}) => {
    const options = {
        ...passedOptions,
        headers: {
            accept: 'application/json',
            ...authHeaders,
            ...passedOptions.headers,
        },
    } as RequestInitWithBody;
    const body = options.body;
    const method = options.method?.toUpperCase();

    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        options.headers = {
            accept: 'application/json',
            'content-type': 'application/json',
            // allow manual override of 'content-type' by placing this after
            ...options.headers,
        };
    }
    const stringified = body && typeof body !== 'string' ? JSON.stringify(body) : body;
    const optionsWithBody = { ...options, body: stringified };
    const res = await fetch(`${EMAIL_ENGINE_API_URL}${path}`, optionsWithBody);
    await handleResError(res);
    const json = await res.json();
    return json as T;
};
